import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { HTTP_STATUSES } from 'src/core/utils/utils';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';
import { AiAssistantDialogViewDto } from '../ai-assistant/ai-assistant-chats/ai-assistant-dialog/ai-assistant-dialog-dto/ai-assistant-dialog-view.dto';
import { DialogAiAssistantQueryRepository } from '../ai-assistant/ai-assistant-chats/ai-assistant-dialog/ai-assistant-dialog-infrastructure/ai-assistant-dialog-query.repository';

@Injectable()
export class ContinueInterceptor implements NestInterceptor {
    constructor(
        private readonly usersRepository: UsersRepository,
        private dialogQueryRepository: DialogAiAssistantQueryRepository,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = context.switchToHttp().getResponse();
        let isChat
        const body = request.body;
        // console.log('ContinueInterceptor: - 👍🏻👍🏻👍🏻 body.login', body.login)

        const userMessages = body.messages?.filter((m: any) => m.role !== 'system') || [];
        const lastMessage = userMessages[userMessages.length - 1]?.content || '';


        // console.log('ContinueInterceptor: - 👍🏻👍🏻👍🏻 body ', body)
        // console.log('ContinueInterceptor: - 👍🏻👍🏻👍🏻 lastMessage ', lastMessage)

        // Только для Continue
        // if (request.url.includes('/admin/v1/chat/completions')) {

        // senderId → админ
        const admin = await this.usersRepository.findByAdminRepository('ADMIN');
        if (!admin) throw new DomainException(HTTP_STATUSES.NOT_FOUND_404, 'Admin not found');
        // console.log('ContinueInterceptor: - 👍🏻👍🏻👍🏻 admin ', admin)

        // console.log('ContinueInterceptor: - 👍🏻👍🏻👍🏻 body.receiverId', body.receiverId)
        // receiverId → ассистент
        let assistant = body.receiverId
            ? await this.usersRepository.findById(body.receiverId)
            : null;

        // console.log('ContinueInterceptor: - 👍🏻👍🏻👍🏻 assistant ID', assistant)

        if (!assistant) {
            // assistant = await this.usersRepository.findByLoginOrEmail('MR 3');
            assistant = await this.usersRepository.findByAdminRepository('ORCHESTRATOR');
            // console.log('ContinueInterceptor: - 👍🏻👍🏻👍🏻 assistant LOGIN', assistant)
        }

        if (!assistant) {
            throw new DomainException(HTTP_STATUSES.NOT_FOUND_404, 'Assistant not found');
        }

        const isDialog = await this.dialogQueryRepository.findOneDialogBySenderIdOrReceiverIdRepository(admin._id.toString(), assistant._id.toString());
        // const dialogView = AiAssistantDialogViewDto.mapToView(isDialog);
        // isChat = await this.dialogQueryRepository.findDialogByIdOrNotFoundFailRepository(dialogId)

        // console.log('ContinueInterceptor: - 👍🏻👍🏻👍🏻 isDialog', isDialog)

        // Подставляем правильные данные в body
        request.body.localId = String(Date.now());      // логин админа
        request.body.prompt = lastMessage;      // логин админа
        request.body.dialogId = isDialog?._id;      // логин админа
        request.body.senderId = admin._id.toString();     // логин админа
        request.body.receiverId = assistant._id.toString();   // ID ассистента
        // }

        return next.handle()
            .pipe(
                map(data => {

                    const isStream = request.headers.accept?.includes('text/event-stream');
                    if (!isStream) return data;

                    response.setHeader('Content-Type', 'text/event-stream');
                    response.setHeader('Cache-Control', 'no-cache');
                    response.setHeader('Connection', 'keep-alive');

                    const content = data.assistantResponse?.content || '';

                    const chunk = {
                        id: `chatcmpl-${Date.now()}`,
                        object: 'chat.completion.chunk',
                        created: Math.floor(Date.now() / 1000),
                        model: request.body.model,
                        choices: [{
                            index: 0,
                            delta: { content },
                            finish_reason: null
                        }]
                    };

                    response.write(`data: ${JSON.stringify(chunk)}\n\n`);
                    response.write(`data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: 'stop' }] })}\n\n`);
                    response.write('data: [DONE]\n\n');

                    response.end();
                    return;
                })
            );

    }
}