import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { AiAssistantMessage, AiAssistantMessageDocument, type AiAssistantMessageModelType } from '../ai-assistant-msg-domain/ai-assistant-msg.entity';
import { GetAiAssistantMessageQueryParams } from '../ai-assistant-msg-dto/get-msg-query-params.input-dto';
import { AiAssistantMessageViewDto } from '../ai-assistant-msg-api/viev-dto-msg/msg-all.view-dto';
import { queryMaperArrUserMessages } from '../../ai-assistant-maper/queryMaper';

@Injectable()
export class MessageAiAssistantQueryRepository {
    constructor(
        @InjectModel(AiAssistantMessage.name) private AiAssistantMessageModel: AiAssistantMessageModelType
    ) { }

    async getAllMessagesByAiAssistantIdQueryRepository(userId: string, query: GetAiAssistantMessageQueryParams, dialogId: string): Promise<PaginatedViewDto<AiAssistantMessageViewDto[]>> {
        // console.log('MessageAiAssistantQueryRepository: getAllMessagesByAiAssistantIdQueryRepository: query 😡 ', query)
        const normalizedQuery = GetAiAssistantMessageQueryParams.normalize(query);
        // console.log('MessageAiAssistantQueryRepository: getAllMessagesByAiAssistantIdQueryRepository: normalizedQuery 😡 ', normalizedQuery)
        const filter: FilterQuery<AiAssistantMessage> = {
            deletedAt: null,
            dialogId: dialogId,
            // senderId: userId,
        };
        // console.log('MessageAiAssistantQueryRepository: getAllMessagesByAiAssistantIdQueryRepository: filter 😡 ', filter)

        if (normalizedQuery.searchTextMessage) {
            filter.$or = [
                {
                    message: {
                        $regex: normalizedQuery.searchTextMessage,
                        $options: 'i'
                    }
                }
            ];
        }
        // console.log('MessageAiAssistantQueryRepository: getAllMessagesByAiAssistantIdQueryRepository: normalizedQuery 😡 PREV REQ', normalizedQuery)

        const messages = await this.AiAssistantMessageModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.AiAssistantMessageModel.countDocuments(filter);

        // const items = blogs.map(BlogViewDto.mapToBlogsView).reverse();
        const items = queryMaperArrUserMessages(messages, userId).map(AiAssistantMessageViewDto.mapToMessagesAiAssistantAllView).reverse()

        // items.reverse()

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }

    async findMessageById(id: string): Promise<AiAssistantMessageDocument | null> {
        return this.AiAssistantMessageModel.findOne({
            _id: new Types.ObjectId(id),
            deletedAt: null,
        });
    }

    async findMessageByIdOrNotFoundFailRepository(id: string): Promise<AiAssistantMessageDocument> {
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
    async findMessagesByDialogId(dialogId: string): Promise<AiAssistantMessageDocument[]> {
        return this.AiAssistantMessageModel.find({
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
        return messages
    }
}