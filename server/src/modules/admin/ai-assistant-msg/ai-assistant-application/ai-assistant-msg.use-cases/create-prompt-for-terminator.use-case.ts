import { CommandHandler, ICommandHandler, CommandBus, EventBus } from '@nestjs/cqrs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { CreatePromptAiDto } from '../../ai-assistant-dto/create-prompt-ai-assistant.dto';
import { CreateMessageAiAssistantCommand } from './create-msg-ai-assistant.use-case';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { AiAssistantMessageOneViewDto } from '../../api-ai-assistant-msg/viev-dto-msg/msg-one.view-dto';
import { MessageAiAssistantRepository } from '../../ai-assistant-infrastrucrure/msg-ai-assistant.repository';
import { RulesAiAssistantRepository } from '../../ai-assistant-infrastrucrure/rules-for-ai-assistant.repository';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';

export class CreatePromptForTerminatorCommand {
    constructor(public readonly dto: CreatePromptAiDto) { }
}

@CommandHandler(CreatePromptForTerminatorCommand)
export class CreatePromptForTerminatorUseCase
    implements ICommandHandler<CreatePromptForTerminatorCommand> {

    private readonly logger = new Logger(CreatePromptForTerminatorUseCase.name);
    private readonly nodes: string[];

    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly messageAiAssistantRepository: MessageAiAssistantRepository,
        private readonly rulesAiAssistantRepository: RulesAiAssistantRepository,
        private readonly usersRepository: UsersRepository,

    ) {
        const nodesConfig = this.configService.get<any>('AI_NODES');
        this.nodes = Array.isArray(nodesConfig)
            ? nodesConfig
            : (nodesConfig?.split(',') || []);

        this.logger.log(`AI nodes: ${this.nodes.join(', ')}`);
    }

    async execute(command: CreatePromptForTerminatorCommand) {
        const { localId, prompt, senderId, receiverId, dialogId } = command.dto;
        let systemPrompts: string[] | null = null
        let rule: any[] = [];
        let ollPrompts
        let provider1
        let provider2
        let model1
        let model2

        if (dialogId) {
            ollPrompts = await this.messageAiAssistantRepository.findMessagesByDialogId(dialogId)
        }
        const assistant = await this.usersRepository.findById(receiverId)
        console.log('CreateMessageAiAssistantUseCase: - 👍🏻👍🏻👍🏻 assistant ', assistant)
        if (assistant && assistant.systemUserData && assistant.systemUserData.systemPrompts) {
            systemPrompts = assistant.systemUserData.systemPrompts
            provider1 = assistant.systemUserData.provider1
            model1 = assistant.systemUserData.model1
            provider2 = assistant.systemUserData.provider2
            model2 = assistant.systemUserData.model2
        }
        if (systemPrompts && systemPrompts.length) {
            for (let i = 0; systemPrompts.length > i; i++) {
                const result = await this.rulesAiAssistantRepository.findRuleByRuleId(systemPrompts[i])
                if (result) {
                    rule.push(result)
                }
            }
        }
        console.log('CreateMessageAiAssistantUseCase: - 👍🏻👍🏻👍🏻 provider1 ', provider1)
        console.log('CreateMessageAiAssistantUseCase: - 👍🏻👍🏻👍🏻 model1 ', model1)
        console.log('CreateMessageAiAssistantUseCase: - 👍🏻👍🏻👍🏻 provider2 ', provider2)
        console.log('CreateMessageAiAssistantUseCase: - 👍🏻👍🏻👍🏻 model2 ', model2)
        // console.log('CreateMessageAiAssistantUseCase: - 👍🏻👍🏻👍🏻 rule ', rule)
        // console.log('CreateMessageAiAssistantUseCase: - 👍🏻👍🏻👍🏻 ollPrompts ', ollPrompts?.lenght)

        const createdMessage = await this.commandBus.execute(
            new CreateMessageAiAssistantCommand(command.dto)
        );

        // 🔴 ФОРМИРУЕМ messages (20 последних + текущий)
        let messages: { role: 'user' | 'assistant', content: string }[] = []

        if (ollPrompts && Array.isArray(ollPrompts)) {
            const lastMessages = ollPrompts.slice(-10)
            console.log('CreateMessageAiAssistantUseCase: - 👍🏻👍🏻👍🏻 lastMessages ', lastMessages)

            messages = lastMessages.map(m => ({
                role: m.senderId === senderId ? 'user' : 'assistant',
                content: m.content
            }))
        }

        // добавляем текущее сообщение
        messages.push({
            role: 'user',
            content: prompt
        })
        console.log('CreateMessageAiAssistantUseCase: - 👍🏻👍🏻👍🏻 messages ', messages)

        // 🔥 1. ВНЕШНИЕ ПРОВАЙДЕРЫ (ПЕРВЫЕ)
        try {
            let response: string;
            // 🔴 ПЕРЕВОДИМ МАССИВ ПРАВИЛ В ОДНУ СТРОКУ
            // Если в БД текст лежит в поле contentRules (как на фронте), берем его. 
            // Если поле называется иначе - замени r.contentRules на свое.
            const compiledSystemPrompt = rule.length > 0
                ? rule.map(r => r.contentRules).join('\n\n')
                : undefined;

            if (provider1 === 'openai') {
                response = await this.sendToOpenAI(messages);
            } else if (provider1 === 'google') {
                // 👉 Передаем строку compiledSystemPrompt
                response = await this.sendToGoogle(messages, model1, compiledSystemPrompt);
            } else {
                // 👉 default = GOOGLE (чтобы был free)
                response = await this.sendToGoogle(messages, model1, compiledSystemPrompt);
            }

            return await this.saveResponse(
                response,
                localId,
                senderId,
                receiverId,
                dialogId,
                createdMessage
            );

        } catch (e) {
            this.logger.error('❌ External provider FAILED', e?.response?.data || e.message);
        }

        // 🔁 2. FALLBACK → OLLAMA
        for (const node of this.nodes) {
            try {
                const response = await this.sendToOllama(node, prompt, model2);

                return await this.saveResponse(
                    response,
                    localId,
                    senderId,
                    receiverId,
                    dialogId,
                    createdMessage
                );

            } catch (e) {
                this.logger.warn(`Node failed: ${node}`);
            }
        }

        throw new DomainException(
            HTTP_STATUSES.BAD_REQUEST_400,
            'All providers failed'
        );
    }

    private async saveResponse(
        response: string,
        localId: string,
        senderId: string,
        receiverId: string,
        dialogId: string | undefined,
        createdMessage: AiAssistantMessageOneViewDto
    ) {
        const resPrompt = {
            localId,
            prompt: response,
            receiverId: senderId,
            senderId: receiverId,
            dialogId: dialogId
        };

        const assistantResponse = await this.commandBus.execute(
            new CreateMessageAiAssistantCommand(resPrompt)
        );

        return {
            userPrompt: createdMessage,
            assistantResponse,
        };
    }
    // 🔹 GOOGLE (FREE)
    private async sendToGoogle(
        messages: { role: 'user' | 'assistant'; content: string }[],
        model?: string,
        systemPrompt?: string // Добавляем аргумент для системного промпта
    ) {
        const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
        const defaultModel = this.configService.get<string>('AI_MODEL_IDENTIFIER') || 'gemini-1.5-flash';

        if (!apiKey) throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'GOOGLE_API_KEY NOT SET');

        const usedModel = model || defaultModel;

        // Конвертируем историю диалога
        const contents = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        // Формируем тело запроса
        const payload: any = {
            contents: contents,
        };

        // 🔥 Если системный промпт передан — добавляем его в специальное поле
        if (systemPrompt) {
            payload.system_instruction = {
                parts: [{ text: systemPrompt }]
            };
        }

        const { data } = await firstValueFrom(
            this.httpService.post(
                `https://generativelanguage.googleapis.com/v1beta/models/${usedModel}:generateContent?key=${apiKey}`,
                payload, // Отправляем подготовленный объект
                { timeout: 60 * 10 * 1000 }
            )
        );

        return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    }
    // 🔹 OPENAI
    private async sendToOpenAI(prompt: { role: 'user' | 'assistant', content: string }[]) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');

        if (!apiKey) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'OPENAI_API_KEY NOT SET');
        }

        const { data } = await firstValueFrom(
            this.httpService.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                    timeout: 60000,
                }
            )
        );

        return data.choices[0].message.content;
    }
    // 🔹 OLLAMA
    private async sendToOllama(nodeUrl: string, prompt: string, model?: string) {
        const { data } = await firstValueFrom(
            this.httpService.post(
                `${nodeUrl}/api/generate`,
                {
                    model: model || 'codegemma',
                    prompt,
                    stream: false,
                },
                { timeout: 60 * 20 * 1000 }
            )
        );

        return data.response;
    }
}