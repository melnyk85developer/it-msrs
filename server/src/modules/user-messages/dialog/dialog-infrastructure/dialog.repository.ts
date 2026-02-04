import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { Dialog, DialogDocument, type DialogModelType } from '../dialog-domain/dialog-entity';

@Injectable()
export class DialogRepository {
    constructor(
        @InjectModel(Dialog.name) private DialogModel: DialogModelType
    ) { }
    async save(dialog: DialogDocument) {
        await dialog.save();
    }
    async deleteDialog(dialogId: string): Promise<any> {
        return this.DialogModel.deleteOne({
            _id: new Types.ObjectId(dialogId),
        });
    }
    async findDialogById(dialogId: string): Promise<DialogDocument | null> {
        return this.DialogModel.findOne({
            _id: new Types.ObjectId(dialogId),
            deletedAt: null,
        });
    }

    async findDialogByIdOrNotFoundFailRepository(dialogId: string): Promise<DialogDocument> {
        let dialog
        if (!dialogId || dialogId === undefined || dialogId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            dialog = await this.findDialogById(dialogId);
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