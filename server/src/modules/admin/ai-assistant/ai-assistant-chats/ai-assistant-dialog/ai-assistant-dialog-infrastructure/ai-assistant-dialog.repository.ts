import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DialogAiAssistant, DialogAiAssistantDocument, type DialogAiAssistantModelType } from '../ai-assistant-dialog-domain/ai-assistant-dialog-entity';

@Injectable()
export class DialogAiAssistantRepository {
    constructor(
        @InjectModel(DialogAiAssistant.name) private DialogModel: DialogAiAssistantModelType
    ) { }
    async save(dialog: DialogAiAssistantDocument) {
        await dialog.save();
    }
    async deleteDialog(dialogId: string): Promise<any> {
        console.log('BlogsRepository: deleteDialog 😡😡😡 - dialogId', dialogId)
        return this.DialogModel.deleteOne({
            _id: new Types.ObjectId(dialogId),
        });
    }
    async findDialogById(dialogId: string): Promise<DialogAiAssistantDocument | null> {
        return this.DialogModel.findOne({
            _id: new Types.ObjectId(dialogId),
            deletedAt: null,
        });
    }

    async findDialogByIdOrNotFoundFailRepository(dialogId: string): Promise<DialogAiAssistantDocument> {
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

    async findAllDialogsForUserRepository(userId: string): Promise<DialogAiAssistant[]> {
        return await this.DialogModel.find({
            $or: [
                { userAId: userId },
                { userBId: userId }
            ]
        });
    }

    async findOneDialogBySenderIdOrReceiverIdRepository(senderId: string, receiverId: string): Promise<DialogAiAssistantDocument | null> {
        return await this.DialogModel.findOne({
            $or: [
                { userAId: senderId, userBId: receiverId },
                { userAId: receiverId, userBId: senderId }
            ]
        })
    }
}