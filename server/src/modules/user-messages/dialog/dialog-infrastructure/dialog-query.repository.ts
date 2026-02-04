import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { Dialog, DialogDocument, type DialogModelType } from '../dialog-domain/dialog-entity';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { DialogsAllViewDto } from '../../msg/msg-api/viev-dto-msg/dialogs-all.view-dto';
import { GetDialogsQueryParams } from '../../msg/msg-dto/msg-input-dto/get-all-dialogs-query-params.input-dto';

@Injectable()
export class DialogQueryRepository {
    constructor(
        @InjectModel(Dialog.name) private DialogModel: DialogModelType
    ) { }

    async getAllDialogsByUserIdQueryRepository(normalizedQuery: GetDialogsQueryParams, filter: FilterQuery<Dialog>): Promise<DialogDocument[]> {
        // console.log('BlogsQueryRepository: getAllBlogRepository: query 😡 ', query)
        // console.log('BlogsQueryRepository: getAllBlogRepository: normalizedQuery 😡 PREV REQ', normalizedQuery)

        return await this.DialogModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);
    }

    async findDialogById(id: string): Promise<DialogDocument | null> {
        return this.DialogModel.findOne({
            _id: new Types.ObjectId(id),
            deletedAt: null,
        });
    }

    async findDialogByIdOrNotFoundFailRepository(id: string): Promise<DialogDocument> {
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
    async findAllDialogsForUserRepository(userId: string): Promise<Dialog[]> {
        return await this.DialogModel.find({
            $or: [
                { userAId: userId },
                { userBId: userId }
            ]
        });
    }

    async findOneDialogBySenderIdOrReceiverIdRepository(senderId: string, receiverId: string): Promise<DialogDocument | null> {
        return await this.DialogModel.findOne({
            $or: [
                { userAId: senderId, userBId: receiverId },
                { userAId: receiverId, userBId: senderId }
            ]
        })
    }
}