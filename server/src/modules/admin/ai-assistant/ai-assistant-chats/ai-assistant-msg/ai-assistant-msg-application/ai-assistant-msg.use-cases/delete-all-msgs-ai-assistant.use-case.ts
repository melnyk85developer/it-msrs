import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DialogRepository } from 'src/modules/user-messages/dialog/dialog-infrastructure/dialog.repository';
import { MessageAiAssistantRepository } from '../../ai-assistant-msg-infrastrucrure/msg-ai-assistant.repository';
import { DialogAiAssistantRepository } from 'src/modules/admin/ai-assistant/ai-assistant-chats/ai-assistant-dialog/ai-assistant-dialog-infrastructure/ai-assistant-dialog.repository';


export class DeleteAiAssistantAllMessagesCommand {
    constructor(
        public receiverId: string,
        public userId: string,
        public deleteOption: string
    ) { }
}

@CommandHandler(DeleteAiAssistantAllMessagesCommand)
export class DeleteAiAssistantAllMessagesUseCase
    implements ICommandHandler<DeleteAiAssistantAllMessagesCommand, boolean> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private aiAssistantMessagesRepository: MessageAiAssistantRepository,
        private aiAssistantDialogRepository: DialogAiAssistantRepository
    ) { }
    async execute(command: DeleteAiAssistantAllMessagesCommand): Promise<boolean> {
        const { userId, receiverId, deleteOption } = command;

        let msgs = [] as any
        // console.log('deleteAllMessagesServices - 🤪🤪🤪 - senderId, receiverId, userId, deleteOption', senderId, receiverId, userId, deleteOption)
        const isDialog = await this.aiAssistantDialogRepository.findOneDialogBySenderIdOrReceiverIdRepository(userId, receiverId)
        // console.log('MessageService: deleteDialogService - 🤪🤪🤪 - isDialog', isDialog)
        if (!isDialog || isDialog && isDialog.userAId !== userId && isDialog.userBId !== userId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDEN_DELETION_IS_PROHIBITED_FOR_ALL_OF_YOU_WHO_ARE_NOT_THE_AUTHORS_OF_THIS_MESSAGE)
        }
        const messages = await this.aiAssistantMessagesRepository.findMessagesBySenderIdOrReceiverIdOrNotFoundFailRepository(userId, receiverId);
        // console.log('deleteAllMessagesServices - 🤪🤪🤪 - messages.length', messages.length)
        // const isAdmin = user.roles.some(entry => entry.value === 'ADMIN')
        // if (isAdmin && messages) {
        //     return await this.usersMessagesRepository.deleteAllMessagesRepository(senderId, receiverId)
        // }
        for (let i = 0; messages.length > i; i++) {
            const newMeta: any[] = [...messages[i].meta];
            // console.log('deleteAllMessagesServices: - newMeta 😡 ', newMeta)
            if (userId === messages[i].senderId) {
                // console.log('deleteAllMessagesServices: - deleteOption 😡 1', deleteOption)
                const alreadyDeleted = messages[i].meta.some(entry => entry.userId === userId);
                if (!alreadyDeleted) {
                    // console.log('deleteAllMessagesServices: - alreadyDeleted 😡 1', alreadyDeleted)
                    msgs.push(messages[i])
                }
            }
            if (userId === messages[i].receiverId) {
                const alreadyDeleted = messages[i].meta.some(entry => entry.userId === messages[i].receiverId);
                if (!alreadyDeleted) {
                    // console.log('deleteAllMessagesServices: - alreadyDeleted 😡 2', alreadyDeleted)
                    msgs.push(messages[i])
                }
            }
            // console.log('deleteAllMessagesServices: - msgs 😡 ', msgs)
        }
        if (msgs && msgs.length) {
            for (let i = 0; msgs.length > i; i++) {
                const newMeta: any[] = [...msgs[i].meta];
                // console.log('deleteAllMessagesServices: - msgs 😡 for 2', msgs.length)
                // console.log('deleteAllMessagesServices: - newMeta 😡 ', newMeta)
                if (userId === msgs[i].senderId) {
                    // console.log('deleteAllMessagesServices: - deleteOption 😡 1', deleteOption)
                    const alreadyDeleted = msgs[i].meta.some(entry => entry.userId === userId);
                    // console.log('deleteAllMessagesServices: - alreadyDeleted 😡 1', alreadyDeleted, newMeta)
                    if (!alreadyDeleted) {
                        newMeta.push({ userId: userId, deletedAt: new Date().toISOString() });
                    }
                }
                if (userId === msgs[i].receiverId) {
                    // console.log('deleteAllMessagesServices: - deleteOption 😡 2', deleteOption)
                    const alreadyDeleted = msgs[i].meta.some(entry => entry.userId === msgs[i].receiverId);
                    if (!alreadyDeleted) {
                        newMeta.push({ userId: userId, deletedAt: new Date().toISOString() });
                    }
                }
                const msg = await this.aiAssistantMessagesRepository.findMessageByIdOrNotFoundFailRepository(msgs[i].id)
                msg.markMsgDeletedForUser(
                    { msgId: msgs[i].id, meta: newMeta }
                );
                await this.aiAssistantMessagesRepository.save(msg);
            }
            return true
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_MESSAGES_FOR_DELETE)
        }
    }
}