import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { MessageAiAssistantQueryRepository } from '../ai-assistant-infrastrucrure/msg-ai-assistant-query.repository';
import { AiAssistantMessage } from '../ai-assistant-domain/ai-assistant.entity';
import { AiAssistantMessagesAllViewDto } from '../api-ai-assistant-msg/viev-dto-msg/msg-all.view-dto';
import { queryMaperArrUserMessages, queryMaperUserMessage } from '../ai-assistant-maper/queryMaper';
import { GetAiAssistantMessageQueryParams } from '../../ai-assistant-dialog/ai-assistant-dialog-dto/get-msg-query-params.input-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';

@Injectable()
export class MessageAiAssistantQueryService {
    private readonly logger = new Logger(MessageAiAssistantQueryService.name);
    private readonly nodes: string[];
    constructor(
        // @InjectModel(Message.name) private MessageModel: MessageModelType,
        // private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly messageAiAssistantQueryRepository: MessageAiAssistantQueryRepository,
    ) {
        // Убедись, что в .env переменная AI_NODES — это JSON-строка массива или через запятую
        const nodesConfig = this.configService.get<any>('AI_NODES');
        this.nodes = Array.isArray(nodesConfig) ? nodesConfig : (nodesConfig?.split(',') || []);
        this.logger.log(`Initialized AI Cluster with nodes: ${this.nodes.join(', ')}`);
    }
    async getAllAiAssistantMessagesByDialogIdService(userId: string, dialogId: string, query: GetAiAssistantMessageQueryParams): Promise<PaginatedViewDto<AiAssistantMessagesAllViewDto[]>> {
        const messages = await this.messageAiAssistantQueryRepository.getAllMessagesByAiAssistantIdQueryRepository(userId, query, dialogId);
        // console.log('MessageAiAssistantQueryService: getAllAiAssistantMessagesByDialogIdService - RES messages', messages.items);
        if (messages && messages.items.length) {
            return messages
        } else {
            return {
                ...messages,
                items: []
            }
        }
    }
    async getMessageByIdOrNotFoundFailQueryService(msgId: string, userId: string): Promise<AiAssistantMessagesAllViewDto> {
        const message = await this.messageAiAssistantQueryRepository.findMessageByIdOrNotFoundFailRepository(msgId);
        // console.log('MessageQueryService - RES getAllMessagesByDialogIdService message', message);
        const filtered = queryMaperUserMessage(message, userId);
        // console.log('MessageQueryService - RES getAllMessagesByDialogIdService filtered', filtered);
        if (!filtered) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_MESSAGE);
        }
        return AiAssistantMessagesAllViewDto.mapToMessagesAiAssistantAllView(filtered);
    }
    async _getMessage(msgId: string): Promise<AiAssistantMessage | null> {
        return await this.messageAiAssistantQueryRepository.findMessageByIdOrNotFoundFailRepository(msgId);
    }
}
