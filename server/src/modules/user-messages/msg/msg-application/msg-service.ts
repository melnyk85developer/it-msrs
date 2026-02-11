import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Message, type MessageModelType } from '../msg-domain/msg-entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { MessageRepository } from '../msg-infrastructure/msg.repository';
import { CreateMessageDto } from '../msg-dto/create-msg.dto';
import { DialogService } from '../../dialog/dialog-application/dialog-service';
import { Multer } from 'multer';
import { MessageOneViewDto } from '../msg-api/viev-dto-msg/msg-one.view-dto';
import { UpdateMessageDto } from '../msg-dto/update-msg.dto';
import { UpdateMessageReadDomainDto } from '../msg-dto/update-msg-read-domain.dto';
import { isDialogDeletedForUser } from '../maper/queryMaper';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private MessageModel: MessageModelType,
        private messageRepository: MessageRepository,
        private dialogsService: DialogService,
    ) { }
    async createMessageService(dto: Omit<CreateMessageDto, 'dialogId'>, attachments?: [Multer.File]): Promise<MessageOneViewDto> {
        const { localId, senderId, receiverId, message, replyToMessageId } = dto
        // console.log('createMessageServices: - 👍🏻 dto ', dto)
        const isDialog = await this.dialogsService._getOneDialogBySenderIdOrReceiverIdRepository(
            senderId,
            receiverId
        )
        if (isDialog) {
            // console.log('createMessageServices: - 😜😜😜 isDialog', isDialog)
            // console.log('createMessageServices: - 😡😡😡, senderId, receiverId', senderId, receiverId)
            if (isDialogDeletedForUser(isDialog.meta, senderId)) {
                // console.log('createMessageServices: - 😡😡😡, isDialogDeletedForUser(isDialog.meta, senderId)', isDialogDeletedForUser(isDialog.meta, senderId))
                await this.dialogsService.updateDialogService(isDialog.id, senderId)
            }
            if (isDialogDeletedForUser(isDialog.meta, receiverId)) {
                // console.log('createMessageServices: - 😡😡😡, isDialogDeletedForUser(isDialog.meta, receiverId)', isDialogDeletedForUser(isDialog.meta, receiverId))
                await this.dialogsService.updateDialogService(isDialog.id, receiverId)
            }
            const msg = this.MessageModel.createMessageInstance(
                {
                    ...dto,
                    message,
                    senderId: senderId,
                    receiverId: receiverId,
                    // read: Boolean(read),
                    dialogId: isDialog.id,
                    replyToMessageId: replyToMessageId ? replyToMessageId : null,
                }
            )
            // console.log('createMessageServices: msg1', msg)
            await this.messageRepository.save(msg);
            // console.log('createMessageServices: msg2', msg)
            return MessageOneViewDto.mapToOneMessageView(msg, localId)
        } else {
            // console.log('createMessageServices: - 😡😡😡, senderId, receiverId', senderId, receiverId)
            const newUserDialogId = await this.dialogsService.createDialogService(
                { userAId: senderId, userBId: receiverId }
            )
            // console.log('createMessageServices: newUserDialogId', newUserDialogId)
            const msg = this.MessageModel.createMessageInstance(
                {
                    ...dto,
                    message,
                    senderId: senderId,
                    receiverId: receiverId,
                    // read: Boolean(read),
                    dialogId: newUserDialogId,
                    replyToMessageId: null,
                }
            )
            // console.log('createMessageServices: msg1', msg)
            await this.messageRepository.save(msg);
            // console.log('createMessageServices: msg2', msg)
            return MessageOneViewDto.mapToOneMessageView(msg, localId)
        }
    }
    async updateMessagesServices(userId: string, dto: Omit<UpdateMessageDto, 'attachments'>, file?: [Multer.File]): Promise<string> {
        const { msgId, senderId, receiverId, message, replyToMessageId } = dto
        // console.log('updateMessagesServices: - 👍🏻 message ', message)
        if (userId !== senderId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDEN_TO_UPDATE_YOU_ARE_NOT_A_MEMBER_OF_THIS_MESSAGE)
        }
        const msg = await this.messageRepository.findMessageByIdOrNotFoundFailRepository(msgId)
        const attachments = []
        msg.updateMessage({
            ...dto,
            attachments,
            replyToMessageId: replyToMessageId ? replyToMessageId : null
        });
        // console.log('updateMessagesServices: - 🤪🤪🤪 msg1', msg)
        await this.messageRepository.save(msg);
        // console.log('updateMessagesServices: - 🤪🤪🤪 msg2', msg)
        return msg._id.toString();
    }
    async updateReadServices(userId: string, dto: UpdateMessageReadDomainDto): Promise<string> {
        // console.log('updateReadServices: - 👍🏻 msg ', dto.msgId)
        const msg = await this.messageRepository.findMessageByIdOrNotFoundFailRepository(dto.msgId)
        if (userId !== msg.senderId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDEN_TO_UPDATE_YOU_ARE_NOT_A_MEMBER_OF_THIS_MESSAGE)
        }
        msg.updateRead(dto);
        await this.messageRepository.save(msg);
        return msg._id.toString();
    }
    async deleteAllMessagesServices(receiverId: string, userId: string, deleteOption: string): Promise<boolean> {
        let msgs
        // console.log('deleteAllMessagesServices - 🤪🤪🤪 - senderId, receiverId, userId, deleteOption', senderId, receiverId, userId, deleteOption)
        const isDialog = await this.dialogsService._getOneDialogBySenderIdOrReceiverIdRepository(userId, receiverId)
        // console.log('MessageService: deleteDialogService - 🤪🤪🤪 - isDialog', isDialog)
        if (!isDialog || isDialog && isDialog.userAId !== userId && isDialog.userBId !== userId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDEN_DELETION_IS_PROHIBITED_FOR_ALL_OF_YOU_WHO_ARE_NOT_THE_AUTHORS_OF_THIS_MESSAGE)
        }
        const messages = await this.messageRepository.findMessagesBySenderIdOrReceiverIdOrNotFoundFailRepository(userId, receiverId);
        console.log('deleteAllMessagesServices - 🤪🤪🤪 - messages.length', messages.length)
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
                    console.log('deleteAllMessagesServices: - alreadyDeleted 😡 1', alreadyDeleted)
                    msgs.push(messages[i])
                }
            }
            if (userId === messages[i].receiverId) {
                const alreadyDeleted = messages[i].meta.some(entry => entry.userId === messages[i].receiverId);
                if (!alreadyDeleted) {
                    console.log('deleteAllMessagesServices: - alreadyDeleted 😡 2', alreadyDeleted)
                    msgs.push(messages[i])
                }
            }
            console.log('deleteAllMessagesServices: - msgs 😡 ', msgs)
        }
        if (msgs && msgs.length) {
            for (let i = 0; msgs.length > i; i++) {
                const newMeta: any[] = [...msgs[i].meta];
                console.log('deleteAllMessagesServices: - msgs 😡 for 2', msgs)
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
    async deleteMessageByMsgIdServices(userId: string, msgId: string, deleteOption: string): Promise<{ statusCode: number; message: string; } | any> {
        const message = await this.messageRepository.findMessageByIdOrNotFoundFailRepository(msgId)
        const newMeta: any[] = [...message.meta]

        if (userId !== message.senderId && userId !== message.receiverId) {
            // console.log('deleteMessageByMsgIdServices: message', message)
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
    async getAllMessagesByUserIdService(dialogId: string): Promise<Message[]> {
        const messages = await this.messageRepository.findMessagesByDialogIdOrNotFoundFailRepository(dialogId);
        return messages
    }
    async deleteDialogService(dialogId: string, userId: string): Promise<any> {
        // console.log('MessageService: dialogId', dialogId);
        const messages = await this.messageRepository.findMessagesByDialogIdOrNotFoundFailRepository(dialogId);
        // console.log('MessageService - 🤪🤪🤪 - messages', messages)
        const isDialog = await this.dialogsService._getDialogsByIdService(dialogId)
        console.log('MessageService: deleteDialogService - 🤪🤪🤪 - isDialog', isDialog)
        // const isAdmin = user.roles.some(entry => entry.value === 'ADMIN')
        // if (isAdmin && messages) {
        //     return await this.usersMessagesRepository.deleteAllMessagesRepository(senderId, receiverId)
        // }
        if (messages && messages.length) {
            for (let i = 0; messages.length > i; i++) {
                const newMeta: any[] = [...messages[i].meta];
                // console.log('deleteAllMessagesServices: - newMeta 😡 ', newMeta)
                if (userId === messages[i].senderId) {
                    // console.log('deleteAllMessagesServices: - deleteOption 😡 1', deleteOption)
                    const alreadyDeleted = messages[i].meta.some(entry => entry.userId === userId);
                    // console.log('deleteAllMessagesServices: - alreadyDeleted 😡 1', alreadyDeleted, newMeta)
                    if (!alreadyDeleted) {
                        newMeta.push({ userId: userId, deletedAt: new Date().toISOString() });
                    }
                }
                if (userId === messages[i].receiverId) {
                    // console.log('deleteAllMessagesServices: - deleteOption 😡 2', deleteOption)
                    const alreadyDeleted = messages[i].meta.some(entry => entry.userId === messages[i].receiverId);
                    if (!alreadyDeleted) {
                        newMeta.push({ userId: userId, deletedAt: new Date().toISOString() });
                    }
                }
                const msg = await this.messageRepository.findMessageByIdOrNotFoundFailRepository(messages[i].id)
                msg.markMsgDeletedForUser({ msgId: messages[i].id, meta: newMeta });
                await this.messageRepository.save(msg);
            }
            return await this.dialogsService.deleteDialogService(dialogId, userId)
        } else {
            return await this.dialogsService.deleteDialogService(dialogId, userId)
        }

    }
    // async deleteMessage(msgId: string): Promise<string> {
    //     const isMessage = await this.messageRepository.findMessageByIdOrNotFoundFailRepository(msgId)
    //     // console.log('TokenService: deleteTokenBlackList - isToken 😡 ', isToken)
    //     const isDeletedMessage = await this.messageRepository.deleteMessage(msgId)
    //     // console.log('TokenService: deleteTokenBlackList - isDeletedToken 😡 ', isDeletedToken)
    //     // const token = this.tokenModel.makeDeletedToken(refreshToken);

    //     await this.messageRepository.save(isMessage);
    //     return isMessage._id.toString();
    // }
    // async _getMessage(msgId: string): Promise<Message | null> {
    //     return await this.messageRepository.findMessageByIdOrNotFoundFailRepository(msgId);
    // }
}
