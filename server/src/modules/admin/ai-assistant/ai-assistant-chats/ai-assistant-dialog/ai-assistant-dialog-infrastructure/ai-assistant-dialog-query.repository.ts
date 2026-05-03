import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DialogAiAssistant, DialogAiAssistantDocument, type DialogAiAssistantModelType } from '../ai-assistant-dialog-domain/ai-assistant-dialog-entity';
import { GetDialogsAiAssistantQueryParams } from '../ai-assistant-dialog-dto/get-all-dialogs-ai-assistant-query-params.input-dto';

@Injectable()
export class DialogAiAssistantQueryRepository {
    constructor(
        @InjectModel(DialogAiAssistant.name) private DialogAiAssistantModel: DialogAiAssistantModelType
    ) { }

    async getAllDialogsByUserIdQueryRepository(normalizedQuery: GetDialogsAiAssistantQueryParams, filter: FilterQuery<DialogAiAssistant>): Promise<DialogAiAssistantDocument[]> {
        // console.log('BlogsQueryRepository: getAllBlogRepository: query 😡 ', query)
        // console.log('BlogsQueryRepository: getAllBlogRepository: normalizedQuery 😡 PREV REQ', normalizedQuery)

        return await this.DialogAiAssistantModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);
    }

    async findDialogById(id: string): Promise<DialogAiAssistantDocument | null> {
        return this.DialogAiAssistantModel.findOne({
            _id: new Types.ObjectId(id),
            deletedAt: null,
        });
    }

    async findDialogByIdOrNotFoundFailRepository(id: string): Promise<DialogAiAssistantDocument> {
        let dialog
        if (!id || id === undefined || id === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            dialog = await this.findDialogById(id);
        }
        if (!dialog) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_DIALOG);
        }
        return dialog;
    }
    async findAllDialogsForUserRepository(userId: string): Promise<DialogAiAssistant[]> {
        return await this.DialogAiAssistantModel.find({
            $or: [
                { userAId: userId },
                { userBId: userId }
            ]
        });
    }

    async findOneDialogBySenderIdOrReceiverIdRepository(senderId: string, receiverId: string): Promise<DialogAiAssistantDocument | null> {
        return await this.DialogAiAssistantModel.findOne({
            $or: [
                { userAId: senderId, userBId: receiverId },
                { userAId: receiverId, userBId: senderId }
            ]
        })
    }
}