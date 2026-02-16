import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DialogRepository } from 'src/modules/user-messages/dialog/dialog-infrastructure/dialog.repository';
import { MessageRepository } from '../../msg-infrastructure/msg.repository';

export class DeleteAllMessageCommand {
    constructor(
        public receiverId: string,
        public userId: string,
        public deleteOption: string
    ) { }
}

@CommandHandler(DeleteAllMessageCommand)
export class DeleteAllMessageUseCase
    implements ICommandHandler<DeleteAllMessageCommand, boolean> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private messageRepository: MessageRepository,
        private dialogRepository: DialogRepository
    ) { }
    async execute(command: DeleteAllMessageCommand): Promise<boolean> {
        const { userId, receiverId, deleteOption } = command;

        let msgs = [] as any
        // console.log('deleteAllMessagesServices - 🤪🤪🤪 - senderId, receiverId, userId, deleteOption', senderId, receiverId, userId, deleteOption)
        const isDialog = await this.dialogRepository.findOneDialogBySenderIdOrReceiverIdRepository(userId, receiverId)
        // console.log('MessageService: deleteDialogService - 🤪🤪🤪 - isDialog', isDialog)
        if (!isDialog || isDialog && isDialog.userAId !== userId && isDialog.userBId !== userId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDEN_DELETION_IS_PROHIBITED_FOR_ALL_OF_YOU_WHO_ARE_NOT_THE_AUTHORS_OF_THIS_MESSAGE)
        }
        const messages = await this.messageRepository.findMessagesBySenderIdOrReceiverIdOrNotFoundFailRepository(userId, receiverId);
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
                const msg = await this.messageRepository.findMessageByIdOrNotFoundFailRepository(msgs[i].id)
                msg.markMsgDeletedForUser({ msgId: msgs[i].id, meta: newMeta });
                await this.messageRepository.save(msg);
            }
            return true
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_MESSAGES_FOR_DELETE)
        }
    }
}