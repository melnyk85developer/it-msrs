import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Message, MessageDocument, type MessageModelType } from '../msg-domain/msg-entity';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetMessageQueryParams } from '../msg-dto/msg-input-dto/get-msg-query-params.input-dto';
import { MessagesAllViewDto } from '../msg-api/viev-dto-msg/msg-all.view-dto';
import { queryMaperArrUserMessages, queryMaperUserMessage } from '../maper/queryMaper';

@Injectable()
export class MessageQueryRepository {
    constructor(
        @InjectModel(Message.name) private MessageModel: MessageModelType
    ) { }

    async getAllMessagesByUserIdQueryRepository(query: GetMessageQueryParams, dialogId: string, userId: string): Promise<PaginatedViewDto<MessagesAllViewDto[]>> {
        // console.log('BlogsQueryRepository: getAllBlogRepository: query 😡 ', query)
        const normalizedQuery = GetMessageQueryParams.normalize(query);
        // console.log('BlogsQueryRepository: getAllBlogRepository: normalizedQuery 😡 ', normalizedQuery)
        const filter: FilterQuery<Message> = {
            deletedAt: null,
        };
        // console.log('BlogsQueryRepository: getAllBlogRepository: filter 😡 ', filter)

        if (normalizedQuery.searchTextMessage) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                message: { $regex: normalizedQuery.searchTextMessage, $options: 'i' },
            });
        }
        // console.log('BlogsQueryRepository: getAllBlogRepository: normalizedQuery 😡 PREV REQ', normalizedQuery)

        const messages = await this.MessageModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.MessageModel.countDocuments(filter);

        // const items = blogs.map(BlogViewDto.mapToBlogsView).reverse();
        const items = messages.map(MessagesAllViewDto.mapToMessagesAllView);

        // items.reverse()

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }

    async findMessageById(id: string): Promise<MessageDocument | null> {
        return this.MessageModel.findOne({
            _id: new Types.ObjectId(id),
            deletedAt: null,
        });
    }

    async findMessageByIdOrNotFoundFailRepository(id: string): Promise<MessageDocument> {
        let message
        if (!id || id === undefined || id === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            message = await this.findMessageById(id);
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
        return messages
    }
}