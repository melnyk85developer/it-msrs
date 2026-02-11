import { Injectable } from '@nestjs/common';
import { DialogRepository } from '../dialog-infrastructure/dialog.repository';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';
import { MessageRepository } from '../../msg/msg-infrastructure/msg.repository';
import { Dialog, type DialogModelType } from '../dialog-domain/dialog-entity';
import { InjectModel } from '@nestjs/mongoose';
import { MessageService } from '../../msg/msg-application/msg-service';
import { queryMaperUserMessage } from '../../msg/maper/queryMaper';

@Injectable()
export class DialogService {
    constructor(
        @InjectModel(Dialog.name) private DialogModel: DialogModelType,
        private dialogRepository: DialogRepository,
        // private usersRepository: UsersRepository,
        // private messageRepository: MessageRepository

    ) { }

    async createDialogService({ userAId, userBId }): Promise<any> {
        // console.log('UsersConversationsService: createConversationsService - userAId, userBId', userAId, userBId);
        const dialog = this.DialogModel.createDialogInstance({
            userAId,
            userBId
        })
        await this.dialogRepository.save(dialog);
        return dialog._id.toString();
    }
    async updateDialogService(dialogId: string, userId: string): Promise<string> {
        // console.log('updateDialogService: dialogId, userId', dialogId, userId);
        const isDialog = await this.dialogRepository.findDialogByIdOrNotFoundFailRepository(dialogId)
        // console.log('updateDialogService: dialogId, userId', dialogId, userId);
        isDialog.updateMarkDialogDeleted(dialogId, userId)
        // console.log('updateDialogService: dialogId, userId', dialogId, userId);
        await this.dialogRepository.save(isDialog);
        // console.log('updateDialogService: dialogId, userId', dialogId, userId);
        return isDialog.id.toString();
    }
    async deleteDialogService(dialogId: string, userId: string): Promise<any> {
        const isDialog = await this.dialogRepository.findDialogByIdOrNotFoundFailRepository(dialogId)
        if (isDialog) {
            isDialog.markDialogDeletedForUser(dialogId, userId)
            await this.dialogRepository.save(isDialog);
            if (isDialog.meta[0].userId === isDialog.userAId && isDialog.meta[1].userId === isDialog.userBId || isDialog.meta[0].userId === isDialog.userBId && isDialog.meta[1].userId === isDialog.userAId) {
                return await this.dialogRepository.deleteDialog(dialogId)
            }
        }
        // console.log('deleteDialogService: dialogId', dialogId);
        return isDialog.id.toString();
    }
    async _getOneDialogBySenderIdOrReceiverIdRepository(senderId: string, receiverId: string): Promise<Dialog | null> {
        const isDialog = await this.dialogRepository.findOneDialogBySenderIdOrReceiverIdRepository(senderId, receiverId);
        return isDialog
    }
    async _getDialogsByIdService(dialogId: string): Promise<any> {
        return await this.dialogRepository.findDialogByIdOrNotFoundFailRepository(dialogId)
    }
}