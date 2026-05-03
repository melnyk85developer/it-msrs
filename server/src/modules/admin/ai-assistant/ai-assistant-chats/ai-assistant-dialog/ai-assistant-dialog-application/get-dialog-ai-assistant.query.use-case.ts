// get-all-providers-models.query.ts
import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { PaginatedViewDto } from "src/core/dto/base.paginated.viev-dto";
import { AiAssistantViewDto } from "src/modules/user-accounts/users-dto/ai-assistant-profile.view-dto";
import { GetAiAssistantMessageQueryParams } from "../../ai-assistant-msg/ai-assistant-msg-dto/get-msg-query-params.input-dto";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { AiAssistantDialogViewDto } from "../ai-assistant-dialog-dto/ai-assistant-dialog-view.dto";
import { UsersQueryRepository } from "src/modules/user-accounts/users-infrastructure/users.query-repository";
import { MessageAiAssistantQueryService } from "../../ai-assistant-msg/ai-assistant-msg-application/msg-ai-assistant-query-service";
import { DialogAiAssistantRepository } from "../ai-assistant-dialog-infrastructure/ai-assistant-dialog.repository";
import { DialogAiAssistantQueryRepository } from "../ai-assistant-dialog-infrastructure/ai-assistant-dialog-query.repository";
import { UsersRepository } from "src/modules/user-accounts/users-infrastructure/users.repository";
import { AiAssistantMessageViewDto } from "../../ai-assistant-msg/ai-assistant-msg-api/viev-dto-msg/msg-all.view-dto";

export type DialogAiAssistantType = {
    allMsg: AiAssistantMessageViewDto[] | [],
    interlocutor: AiAssistantViewDto,
    currentChat: AiAssistantDialogViewDto | {}
}

export class GetDialogAiAssistantQuery {
    constructor(
        public readonly senderId: string,
        public readonly receiverId: string,
        public readonly query: GetAiAssistantMessageQueryParams
    ) { }
}

@QueryHandler(GetDialogAiAssistantQuery)
export class GetDialogAiAssistantQueryUseCase
    implements IQueryHandler<GetDialogAiAssistantQuery> {

    constructor(
        private readonly queryBus: QueryBus,
        private usersQueryRepository: UsersQueryRepository,
        private dialogRepository: DialogAiAssistantRepository,
        private dialogQueryRepository: DialogAiAssistantQueryRepository,
        private usersRepository: UsersRepository,
        private messageAiAssistantQueryService: MessageAiAssistantQueryService
    ) { }

    async execute(query: GetDialogAiAssistantQuery): Promise<PaginatedViewDto<DialogAiAssistantType> | null> {
        const { senderId, receiverId } = query
        console.log('GetAllProvidersModelsQueryUseCase: all-terminators');
        let isChat
        let allMsgAiAssistantForDialog
        const normalizedQuery = GetAiAssistantMessageQueryParams.normalize(query.query);
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
                    query.query
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