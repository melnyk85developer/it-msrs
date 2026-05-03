import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { RulesAiAssistantQueryRepository } from "../ai-assistant-rules-infrastrucrure/rules-for-ai-assistant-query.repository";
import { RulesAiAssistant } from "../ai-assistant-rules-damain/ai-assistant-global-context.entity";

export class GetAllRulesForTerminatorsQuery { }

@QueryHandler(GetAllRulesForTerminatorsQuery)
export class GetAllRulesForTerminatorsQueryUseCase implements IQueryHandler<GetAllRulesForTerminatorsQuery> {
    constructor(
        private readonly rulesAiAssistantQueryRepository: RulesAiAssistantQueryRepository
    ) { }

    async execute(): Promise<RulesAiAssistant[] | null> {
        const rules = await this.rulesAiAssistantQueryRepository.getAllRulesForAiAssistantQueryRepository()
        if (rules) {
            return rules
        } else {
            return null
        }
    }
}