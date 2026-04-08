import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { AiAssistantMessage, AiAssistantMessageDocument, type AiAssistantMessageModelType } from '../ai-assistant-domain/ai-assistant-msg.entity';

@Injectable()
export class MessageAiAssistantRepository {
    constructor(
        @InjectModel(AiAssistantMessage.name) private AiAssistantMessageModelType: AiAssistantMessageModelType
    ) { }
    async save(message: AiAssistantMessageDocument) {
        await message.save();
    }
    async deleteMessage(msgId: string): Promise<any> {
        return this.AiAssistantMessageModelType.deleteOne({
            _id: new Types.ObjectId(msgId),
        });
    }
    async findMessageByMsgId(msgId: string): Promise<AiAssistantMessageDocument | null> {
        return this.AiAssistantMessageModelType.findOne({
            _id: new Types.ObjectId(msgId),
            deletedAt: null,
        });
    }
    async findMessageByIdOrNotFoundFailRepository(msgId: string): Promise<AiAssistantMessageDocument> {
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
    async findMessagesByDialogId(dialogId: string): Promise<AiAssistantMessageDocument[]> {
        return this.AiAssistantMessageModelType.find({
            dialogId: dialogId,
            deletedAt: null,
        });
    }
    async findMessagesByDialogIdOrNotFoundFailRepository(dialogId: string): Promise<AiAssistantMessageDocument[]> {
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
    async findMessagesBySenderIdOrReceiverIdRepository(senderId: string, receiverId: string): Promise<AiAssistantMessageDocument[] | null> {
        // console.log('MessageRepository - 🤪🤪🤪 - senderId, receiverId', senderId, receiverId)
        return await this.AiAssistantMessageModelType.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
    }
    async findMessagesBySenderIdOrReceiverIdOrNotFoundFailRepository(senderId: string, receiverId: string): Promise<AiAssistantMessageDocument[]> {
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