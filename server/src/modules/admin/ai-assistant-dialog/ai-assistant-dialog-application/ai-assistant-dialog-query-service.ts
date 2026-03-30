import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { FilterQuery } from 'mongoose';
import { UsersQueryRepository } from 'src/modules/user-accounts/users-infrastructure/users.query-repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DialogAiAssistant, type DialogAiAssistantModelType } from '../ai-assistant-dialog-domain/ai-assistant-dialog-entity';
import { DialogAiAssistantQueryRepository } from '../ai-assistant-dialog-infrastructure/ai-assistant-dialog-query.repository';
import { GetDialogsAiAssistantQueryParams } from '../ai-assistant-dialog-dto/get-all-dialogs-ai-assistant-query-params.input-dto';
import { MessageAiAssistantQueryService } from '../../ai-assistant-msg/ai-assistant-application/msg-ai-assistant-query-service';
import { DialogsAiAssistantAllViewDto } from '../ai-assistant-dialog-dto/dialog-ai-assistant-all.view-dto';
import { isDialogAiAssistantDeletedForUser } from '../../ai-assistant-msg/ai-assistant-maper/queryMaper';
import { AiAssistantDialogViewDto } from '../../ai-assistant-msg/api-ai-assistant-msg/viev-dto-msg/ai-assistant-dialog-view.dto';
import { GetDialogsQueryParams } from 'src/modules/user-messages/msg/msg-dto/msg-input-dto/get-all-dialogs-query-params.input-dto';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';
import { UserViewDto } from 'src/modules/user-accounts/users-dto/users.view-dto';
import { DialogAiAssistantRepository } from '../ai-assistant-dialog-infrastructure/ai-assistant-dialog.repository';
import { AiAssistantViewDto } from '../../ai-assistant-msg/api-ai-assistant-msg/viev-dto-msg/ai-assistant.view.dto';
import { UserProfileViewDto } from 'src/modules/user-accounts/users-dto/user-profile.view-dto';
import { AiAssistantMessagesAllViewDto } from '../../ai-assistant-msg/api-ai-assistant-msg/viev-dto-msg/msg-all.view-dto';
import { GetAiAssistantMessageQueryParams } from '../../ai-assistant-msg/ai-assistant-dto/get-msg-query-params.input-dto';

export type DialogAiAssistantType = {
    allMsg: AiAssistantMessagesAllViewDto[] | [],
    interlocutor: UserProfileViewDto,
    currentChat: AiAssistantDialogViewDto | {}
}

@Injectable()
export class DialogAiAssistantQueryService {
    constructor(
        private dialogRepository: DialogAiAssistantRepository,
        private dialogQueryRepository: DialogAiAssistantQueryRepository,
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
        private messageAiAssistantQueryService: MessageAiAssistantQueryService
    ) { }

    async getAIAssistantsInterlocutorsQueryService(query: any, userId: string): Promise<any> {
        const normalizedQuery = GetDialogsAiAssistantQueryParams.normalize(query);
        const filter: FilterQuery<DialogAiAssistant> = {
            deletedAt: null,
        };
        // const users = await this.usersRepository.getAllUsersQueryRepository(query)
        const users = await this.usersRepository.findAllUsers()
        // console.log('getAIAssistantsInterlocutorsQueryService: - users', users)
        let bots = users.filter(u => u.systemUserData.isBot === true).map(AiAssistantViewDto.mapToView).reverse();
        // console.log('getAIAssistantsInterlocutorsQueryService: - bots', bots)

        // return await this.dialogAiAssistantQueryService.getAllInterlocutorsByUserIdQueryService(query, userId)

        let interlocutors: any[] = []

        for (let i = 0; bots.length > i; i++) {
            let isDialog = await this.dialogRepository.findOneDialogBySenderIdOrReceiverIdRepository(userId, bots[i].userId)
            interlocutors.push({
                ...bots[i],
                chat: isDialog && AiAssistantDialogViewDto.mapToView(isDialog)
            })
        }
        // const items = bots.map(UserViewDto.mapToView).reverse();

        // InterlocutorViewDto.mapToView

        // console.log('DialogQueryService - RES items', items);

        return PaginatedViewDto.mapToView({
            items: interlocutors,
            totalCount: bots.length,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }
    async getDialogAndMSGQueryService(userId: string, dialogId: string, query: GetAiAssistantMessageQueryParams, receiverId: string): Promise<PaginatedViewDto<DialogAiAssistantType>  | null> {
        if (dialogId && receiverId) {
            const assistant = await this.usersQueryRepository.getProfileQueryRepository(receiverId)
            const isChat = await this.getDialogsByIdService(dialogId)
            const allMsgAiAssistantForDialog = await this.messageAiAssistantQueryService.getAllAiAssistantMessagesByDialogIdService(
                userId,
                dialogId,
                query
            );
            // console.log('getDialogAndMSGQueryService: - assistant', assistant)
            // console.log('getDialogAndMSGQueryService: - isChat', isChat)
            // console.log('getDialogAndMSGQueryService: - allMsgAiAssistantForDialog', allMsgAiAssistantForDialog)

            return {
                ...allMsgAiAssistantForDialog,
                items: {
                    allMsg: allMsgAiAssistantForDialog.items.length ? allMsgAiAssistantForDialog.items : [],
                    interlocutor: assistant,
                    currentChat: isChat ? isChat : {}
                }
            }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_TO_GET_A_DIALOG)
        }
    }
    async getOneDialogBySenderIdOrReceiverIdQueryService(senderId: string, query: GetAiAssistantMessageQueryParams, receiverId: string): Promise<PaginatedViewDto<DialogAiAssistantType>  | null> {
        const isDialog = await this.dialogQueryRepository.findOneDialogBySenderIdOrReceiverIdRepository(senderId, receiverId);
        // console.log('getOneDialogBySenderIdOrReceiverIdQueryService: - isDialog', isDialog)
        if (isDialog === null) {
            return null
        }
        const dialog = AiAssistantDialogViewDto.mapToView(isDialog)
        // console.log('getOneDialogBySenderIdOrReceiverIdQueryService: - dialog', dialog)
        return await this.getDialogAndMSGQueryService(senderId, dialog.dialogId, query, receiverId)
    }
    async getDialogsByIdService(dialogId: string): Promise<AiAssistantDialogViewDto> {
        const isDialog = await this.dialogQueryRepository.findDialogByIdOrNotFoundFailRepository(dialogId)
        return AiAssistantDialogViewDto.mapToView(isDialog)
    }
}