import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { RulesAiAssistant, type RulesAiAssistantModelType } from '../ai-assistant-rules-damain/ai-assistant-global-context.entity';

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