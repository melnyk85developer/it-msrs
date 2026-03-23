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
    ) {
        const nodesConfig = this.configService.get<any>('AI_NODES');
        this.nodes = Array.isArray(nodesConfig)
            ? nodesConfig
            : (nodesConfig?.split(',') || []);

        this.logger.log(`AI nodes: ${this.nodes.join(', ')}`);
    }

    async execute(command: CreatePromptForTerminatorCommand) {
        const { localId, prompt, receiverId, senderId, model, provider } = command.dto as any;

        const createdMessage = await this.commandBus.execute(
            new CreateMessageAiAssistantCommand(command.dto)
        );

        // 🔥 1. ВНЕШНИЕ ПРОВАЙДЕРЫ (ПЕРВЫЕ)
        try {
            let response: string;

            if (provider === 'openai') {
                response = await this.sendToOpenAI(prompt);
            } else if (provider === 'google') {
                response = await this.sendToGoogle(prompt, model);
            } else {
                // 👉 default = GOOGLE (чтобы был free)
                response = await this.sendToGoogle(prompt, model);
            }

            return await this.saveResponse(
                response,
                localId,
                senderId,
                receiverId,
                createdMessage
            );

        } catch (e) {
            this.logger.error('❌ External provider FAILED', e?.response?.data || e.message);
        }

        // 🔁 2. FALLBACK → OLLAMA
        for (const node of this.nodes) {
            try {
                const response = await this.sendToOllama(node, prompt, model);

                return await this.saveResponse(
                    response,
                    localId,
                    senderId,
                    receiverId,
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
        createdMessage: AiAssistantMessageOneViewDto
    ) {
        const resPrompt = {
            localId,
            prompt: response,
            receiverId: senderId,
            senderId: receiverId,
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
    private async sendToGoogle(prompt: string, model?: string) {
        const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
        const defaultModel = this.configService.get<string>('AI_MODEL_IDENTIFIER');
        console.log('sendToGoogle: 🔹 GOOGLE (FREE) defaultModel', defaultModel)

        if (!apiKey) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'GOOGLE_API_KEY NOT SET');
        }

        // Внедрение в проект
        const usedModel = model || defaultModel;

        const { data } = await firstValueFrom(
            this.httpService.post(
                `https://generativelanguage.googleapis.com/v1beta/models/${usedModel}:generateContent?key=${apiKey}`,
                {
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                },
                { timeout: 60000 }
            )
        );

        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    }

    // 🔹 OPENAI
    private async sendToOpenAI(prompt: string) {
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
                { timeout: 120000 }
            )
        );

        return data.response;
    }
}