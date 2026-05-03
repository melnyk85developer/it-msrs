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
import { MessageAiAssistantQueryService } from '../../ai-assistant-msg/ai-assistant-msg-application/msg-ai-assistant-query-service';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';
import { DialogAiAssistantRepository } from '../ai-assistant-dialog-infrastructure/ai-assistant-dialog.repository';
import { AiAssistantViewDto } from '../../ai-assistant-msg/ai-assistant-msg-api/viev-dto-msg/ai-assistant.view.dto';
import { UserProfileViewDto } from 'src/modules/user-accounts/users-dto/user-profile.view-dto';
import { AiAssistantMessageViewDto } from '../../ai-assistant-msg/ai-assistant-msg-api/viev-dto-msg/msg-all.view-dto';
import { GetAiAssistantMessageQueryParams } from '../../ai-assistant-msg/ai-assistant-msg-dto/get-msg-query-params.input-dto';
import { AiAssistantDialogViewDto } from '../ai-assistant-dialog-dto/ai-assistant-dialog-view.dto';

@Injectable()
export class DialogAiAssistantQueryService {
    constructor(
        private dialogRepository: DialogAiAssistantRepository,
        private dialogQueryRepository: DialogAiAssistantQueryRepository,
        private usersRepository: UsersRepository,
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
}