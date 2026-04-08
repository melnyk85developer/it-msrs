import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { AiAssistantMessage, AiAssistantMessageDocument, type AiAssistantMessageModelType } from '../ai-assistant-domain/ai-assistant-msg.entity';
import { GetAiAssistantMessageQueryParams } from '../ai-assistant-dto/get-msg-query-params.input-dto';
import { AiAssistantMessagesAllViewDto } from '../api-ai-assistant-msg/viev-dto-msg/msg-all.view-dto';
import { queryMaperArrUserMessages } from '../ai-assistant-maper/queryMaper';
import { RulesAiAssistant, type RulesAiAssistantModelType } from '../ai-assistant-domain/ai-assistant-global-context.entity';

@Injectable()
export class RulesAiAssistantQueryRepository {
    constructor(
        @InjectModel(RulesAiAssistant.name) private RulesAiAssistantModel: RulesAiAssistantModelType
    ) { }

    async getAllRulesForAiAssistantQueryRepository(): Promise<RulesAiAssistant[]> {
        // console.log('MessageAiAssistantQueryRepository: getAllMessagesByAiAssistantIdQueryRepository: query 😡 ', query)

        // Заменяем find() на findOne(), чтобы вернуть ровно один объект
        return await this.RulesAiAssistantModel.find().lean() as RulesAiAssistant[];
    }
}