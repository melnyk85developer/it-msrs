import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Message, MessageDocument, type MessageModelType } from '../msg-domain/msg-entity';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';

@Injectable()
export class MessageRepository {
    constructor(
        @InjectModel(Message.name) private MessageModel: MessageModelType
    ) { }
    async save(message: MessageDocument) {
        await message.save();
    }
    async deleteMessage(msgId: string): Promise<any> {
        return this.MessageModel.deleteOne({
            _id: new Types.ObjectId(msgId),
        });
    }
    async findMessageByMsgId(msgId: string): Promise<MessageDocument | null> {
        return this.MessageModel.findOne({
            _id: new Types.ObjectId(msgId),
            deletedAt: null,
        });
    }
    async findMessageByIdOrNotFoundFailRepository(msgId: string): Promise<MessageDocument> {
        let message
        if (!msgId || msgId === undefined || msgId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            message = await this.findMessageByMsgId(msgId);
        }
        if (!message) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_MESSAGE);
        }
        return message;
    }
    async findMessagesByDialogId(dialogId: string): Promise<MessageDocument[]> {
        return this.MessageModel.find({
            dialogId: dialogId,
            deletedAt: null,
        });
    }
    async findMessagesByDialogIdOrNotFoundFailRepository(dialogId: string): Promise<MessageDocument[]> {
        let messages
        if (!dialogId || dialogId === undefined || dialogId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            messages = await this.findMessagesByDialogId(dialogId);
        }
        if (!messages) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_MESSAGE);
        }
        return messages;
    }
    async findMessagesBySenderIdOrReceiverIdRepository(senderId: string, receiverId: string): Promise<MessageDocument[] | null> {
        // console.log('MessageRepository - 🤪🤪🤪 - senderId, receiverId', senderId, receiverId)
        return await this.MessageModel.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
    }
    async findMessagesBySenderIdOrReceiverIdOrNotFoundFailRepository(senderId: string, receiverId: string): Promise<MessageDocument[]> {
        let messages
        if (!senderId || senderId === undefined || senderId === 'undefined' || !receiverId || receiverId === undefined || receiverId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            messages = await this.findMessagesBySenderIdOrReceiverIdRepository(senderId, receiverId);
        }
        if (!messages) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_MESSAGE);
        }
        // console.log('MessageRepository - 🤪🤪🤪 - messages', messages)
        return messages;
    }
}