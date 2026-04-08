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
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';
import { DialogAiAssistantRepository } from '../ai-assistant-dialog-infrastructure/ai-assistant-dialog.repository';
import { AiAssistantViewDto } from '../../ai-assistant-msg/api-ai-assistant-msg/viev-dto-msg/ai-assistant.view.dto';
import { UserProfileViewDto } from 'src/modules/user-accounts/users-dto/user-profile.view-dto';
import { AiAssistantMessagesAllViewDto } from '../../ai-assistant-msg/api-ai-assistant-msg/viev-dto-msg/msg-all.view-dto';
import { GetAiAssistantMessageQueryParams } from '../../ai-assistant-msg/ai-assistant-dto/get-msg-query-params.input-dto';
import { AiAssistantDialogViewDto } from '../../ai-assistant-msg/api-ai-assistant-msg/viev-dto-msg/ai-assistant-dialog-view.dto';

export type DialogAiAssistantType = {
    allMsg: AiAssistantMessagesAllViewDto[] | [],
    interlocutor: AiAssistantViewDto,
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
    async getOneDialogBySenderIdOrReceiverIdQueryService(senderId: string, query: GetAiAssistantMessageQueryParams, receiverId: string): Promise<PaginatedViewDto<DialogAiAssistantType> | null> {
        let isChat
        let allMsgAiAssistantForDialog
        const normalizedQuery = GetAiAssistantMessageQueryParams.normalize(query);
        const isDialog = await this.dialogQueryRepository.findOneDialogBySenderIdOrReceiverIdRepository(senderId, receiverId);
        const assistant = await this.usersRepository.findUserByIdOrNotFoundFail(receiverId);

        if (!isDialog && !assistant) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_TO_GET_A_DIALOG);
        }

        if (isDialog) {
            const dialogView = AiAssistantDialogViewDto.mapToView(isDialog);
            isChat = await this.getDialogsByIdService(dialogView.dialogId);

            if (isChat) {
                allMsgAiAssistantForDialog = await this.messageAiAssistantQueryService.getAllAiAssistantMessagesByDialogIdService(
                    senderId,
                    isChat.dialogId,
                    query
                );
            }
        }

        const interlocutor = AiAssistantViewDto.mapToView(assistant);

        // Если есть сообщения, возвращаем их, иначе формируем пустой ответ
        if (allMsgAiAssistantForDialog) {
            return {
                ...allMsgAiAssistantForDialog,
                items: {
                    allMsg: allMsgAiAssistantForDialog.items.length ? allMsgAiAssistantForDialog.items : [],
                    interlocutor,
                    currentChat: isChat || {}
                }
            };
        }

        return PaginatedViewDto.mapToView({
            items: {
                allMsg: [],
                interlocutor,
                currentChat: isChat || {}
            },
            totalCount: 0,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }
    async getDialogsByIdService(dialogId: string): Promise<AiAssistantDialogViewDto> {
        const isDialog = await this.dialogQueryRepository.findDialogByIdOrNotFoundFailRepository(dialogId)
        return AiAssistantDialogViewDto.mapToView(isDialog)
    }
}