import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { MessageAiAssistantRepository } from '../../ai-assistant-infrastrucrure/msg-ai-assistant.repository';

export class DeleteAiAssistantOneMessageCommand {
    constructor(
        public userId: string,
        public msgId: string,
        public deleteOption: string
    ) { }
}

@CommandHandler(DeleteAiAssistantOneMessageCommand)
export class DeleteAiAssistantOneMessagegUseCase
    implements ICommandHandler<DeleteAiAssistantOneMessageCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private messageRepository: MessageAiAssistantRepository
    ) { }
    async execute(command: DeleteAiAssistantOneMessageCommand): Promise<string> {
        const { msgId, userId, deleteOption } = command;
        const message = await this.messageRepository.findMessageByIdOrNotFoundFailRepository(msgId)
        const newMeta: any[] = [...message.meta]

        if (userId !== message.senderId && userId !== message.receiverId) {
            console.log('deleteMessageByMsgIdServices: message', message)
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDEN_DELETION_IS_PROHIBITED_FOR_ALL_OF_YOU_WHO_ARE_NOT_THE_AUTHORS_OF_THIS_MESSAGE)
        }

        // const isAdmin = user.roles.some(entry => entry.value === 'ADMIN')
        // if (isAdmin) {
        //     return await this.usersMessagesRepository.deleteMessageByIdRepository(msgId)
        // }

        if (message && userId === message.senderId) {
            // console.log('deleteMessageByMsgIdServices: userId === senderId', deleteOption, message)
            if (message.meta) {
                const alreadyDeleted = newMeta.some(entry => entry.userId === userId)
                if (!alreadyDeleted && deleteOption === 'me') {
                    newMeta.push({ userId: userId, deletedAt: new Date().toISOString() })
                } else if (!alreadyDeleted && deleteOption === 'all') {
                    return await this.messageRepository.deleteMessage(msgId)
                    // newMeta.push(
                    //     { userId: user.userId, deletedAt: new Date().toISOString() }, 
                    //     { userId: message.receiverId, deletedAt: new Date().toISOString()}
                    // )
                } else {
                    throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_MESSAGES_FOR_DELETE)
                }
            } else {
                newMeta.push({ userId: userId, deletedAt: new Date().toISOString() })
            }
        }
        if (message && userId === message.receiverId) {
            // console.log('deleteMessageByMsgIdServices: deleteOption, message', deleteOption, message)
            if (message.meta) {
                const alreadyDeleted = newMeta.some(entry => entry.userId === message.receiverId)
                if (!alreadyDeleted) {
                    if (deleteOption === 'me') {
                        newMeta.push({ userId: userId, deletedAt: new Date().toISOString() })
                    } else if (deleteOption === 'all') {
                        // 
                        newMeta.push({ userId: userId, deletedAt: new Date().toISOString() })
                        // return INTERNAL_STATUS_CODE.FORBIDEN_DELETION_IS_PROHIBITED_FOR_ALL_OF_YOU_WHO_ARE_NOT_THE_AUTHORS_OF_THIS_MESSAGE
                    }
                } else {
                    throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_MESSAGES_FOR_DELETE)
                }
            } else {
                newMeta.push({ userId: userId, deletedAt: new Date().toISOString() })
            }
        }
        const msg = await this.messageRepository.findMessageByIdOrNotFoundFailRepository(msgId)
        msg.markMsgDeletedForUser({ msgId, meta: newMeta });
        await this.messageRepository.save(msg);
        return msg._id.toString();
    }
}