import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DialogAiAssistantRepository } from '../../ai-assistant-dialog-infrastructure/ai-assistant-dialog.repository';
import { MessageAiAssistantRepository } from 'src/modules/admin/ai-assistant-msg/ai-assistant-infrastrucrure/msg-ai-assistant.repository';

export class DeleteDialogCommand {
    constructor(
        public dialogId: string,
        public userId: string
    ) { }
}

@CommandHandler(DeleteDialogCommand)
export class DeleteDialogAiAssistantUseCase
    implements ICommandHandler<DeleteDialogCommand, void> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private messageAiAssistantRepository: MessageAiAssistantRepository,
        private dialogRepository: DialogAiAssistantRepository
    ) { }
    async execute(command: DeleteDialogCommand): Promise<void> {
        const { dialogId, userId } = command;
        let msgs = [] as any
        // console.log('MessageService: dialogId', dialogId);
        await this.dialogRepository.findDialogByIdOrNotFoundFailRepository(dialogId);
        const messages = await this.messageAiAssistantRepository.findMessagesByDialogIdOrNotFoundFailRepository(dialogId);
        // console.log('MessageService - 🤪🤪🤪 - messages', messages)
        const isDialog = await this.dialogRepository.findDialogById(dialogId)
        // console.log('MessageService: deleteDialogService - 🤪🤪🤪 - isDialog', isDialog)
        if (!isDialog || isDialog && isDialog.userAId !== userId && isDialog.userBId !== userId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDEN_DELETION_IS_PROHIBITED_FOR_ALL_OF_YOU_WHO_ARE_NOT_THE_AUTHORS_OF_THIS_MESSAGE)
        }
        // const isAdmin = user.roles.some(entry => entry.value === 'ADMIN')
        // if (isAdmin && messages) {
        //     return await this.usersMessagesRepository.deleteAllMessagesRepository(senderId, receiverId)
        // }
        for (let i = 0; messages.length > i; i++) {
            const newMeta: any[] = [...messages[i].meta];
            // console.log('deleteAllMessagesServices: - newMeta 😡 ', newMeta)
            if (userId === messages[i].senderId) {
                // console.log('deleteAllMessagesServices: - messages[i].senderId 😡 1', messages[i].senderId)
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
                    // console.log('deleteAllMessagesServices: - msgs[i].senderId 😡 1', msgs[i].senderId)
                    const alreadyDeleted = msgs[i].meta.some(entry => entry.userId === userId);
                    if (!alreadyDeleted) {
                        // console.log('deleteAllMessagesServices: - alreadyDeleted 😡 1', alreadyDeleted, newMeta)
                        newMeta.push({ userId: userId, deletedAt: new Date().toISOString() });
                    }
                }
                if (userId === msgs[i].receiverId) {
                    const alreadyDeleted = msgs[i].meta.some(entry => entry.userId === msgs[i].receiverId);
                    if (!alreadyDeleted) {
                        // console.log('deleteAllMessagesServices: - alreadyDeleted 😡 2', alreadyDeleted)
                        newMeta.push({ userId: userId, deletedAt: new Date().toISOString() });
                    }
                }
                const msg = await this.messageAiAssistantRepository.findMessageByIdOrNotFoundFailRepository(msgs[i].id)
                msg.markMsgDeletedForUser({ msgId: msgs[i].id, meta: newMeta });
                await this.messageAiAssistantRepository.save(msg);
            }
            // console.log('deleteDialogService: dialogId, userId', dialogId, userId);
            const isDialog = await this.dialogRepository.findDialogByIdOrNotFoundFailRepository(dialogId)
            // console.log('deleteDialogService: isDialog 1', isDialog);
            isDialog.markDialogDeletedForUser(dialogId, userId)
            // console.log('deleteDialogService: isDialog 2', isDialog);
            await this.dialogRepository.save(isDialog);
            // console.log('deleteDialogService: isDialog 3', isDialog);
            if (isDialog && isDialog.meta[0]?.userId === isDialog.userAId && isDialog && isDialog.meta[1]?.userId === isDialog.userBId || isDialog && isDialog.meta[0]?.userId === isDialog.userBId && isDialog && isDialog.meta[1]?.userId === isDialog.userAId) {
                // console.log('deleteDialogService: isDialog 4', isDialog);
                return await this.dialogRepository.deleteDialog(dialogId)
            }
            // console.log('deleteDialogService: isDialog 5', isDialog);
            return isDialog.id.toString();
        } else {
            // console.log('deleteDialogService: dialogId, userId', dialogId, userId);
            const isDialog = await this.dialogRepository.findDialogByIdOrNotFoundFailRepository(dialogId)
            // console.log('deleteDialogService: isDialog 1', isDialog);
            isDialog.markDialogDeletedForUser(dialogId, userId)
            // console.log('deleteDialogService: isDialog 2', isDialog);
            await this.dialogRepository.save(isDialog);
            // console.log('deleteDialogService: isDialog 3', isDialog);
            if (isDialog && isDialog.meta[0]?.userId === isDialog.userAId && isDialog && isDialog.meta[1]?.userId === isDialog.userBId || isDialog && isDialog.meta[0]?.userId === isDialog.userBId && isDialog && isDialog.meta[1]?.userId === isDialog.userAId) {
                // console.log('deleteDialogService: isDialog 4', isDialog);
                return await this.dialogRepository.deleteDialog(dialogId)
            }
            // console.log('deleteDialogService: isDialog 5', isDialog);
            return isDialog.id.toString();
        }
    }
}