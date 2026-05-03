import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { RulesAiAssistant, RulesAiAssistantDocument, type RulesAiAssistantModelType } from '../ai-assistant-rules-damain/ai-assistant-global-context.entity';

@Injectable()
export class RulesAiAssistantRepository {
    constructor(
        @InjectModel(RulesAiAssistant.name) private RulesAiAssistantModel: RulesAiAssistantModelType
    ) { }
    async save(rules: RulesAiAssistantDocument) {
        await rules.save();
    }
    async deleteRules(): Promise<any> {
        return this.RulesAiAssistantModel.deleteMany();
    }
    async findRuleByRuleId(promptId: string): Promise<RulesAiAssistantDocument | null> {
        return this.RulesAiAssistantModel.findOne({
            _id: new Types.ObjectId(promptId),
            deletedAt: null,
        })
    }
    async findRuleByRuleIdOrNotFoundFailRepository(id: string): Promise<RulesAiAssistantDocument> {
        let rules
        if (!id || id === undefined || id === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            rules = await this.findRuleByRuleId(id);
        }
        if (!rules) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_MESSAGE);
        }
        return rules;
    }
}