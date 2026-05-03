import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { RulesAiAssistantRepository } from '../ai-assistant-rules-infrastrucrure/rules-for-ai-assistant.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { RulesAiAssistant, type RulesAiAssistantModelType } from '../ai-assistant-rules-damain/ai-assistant-global-context.entity';

export class DeleteAllRulesForTerminatorsCommand {}

@CommandHandler(DeleteAllRulesForTerminatorsCommand)
export class DeleteAllRulesForTerminatorsUseCase implements ICommandHandler<DeleteAllRulesForTerminatorsCommand> {
    constructor(
        @InjectModel(RulesAiAssistant.name) private RulesAiAssistantModelModel: RulesAiAssistantModelType,
        private rulesAiAssistantRepository: RulesAiAssistantRepository,
        private commandBus: CommandBus,
        private eventBus: EventBus,
    ) { }

    async execute(command: DeleteAllRulesForTerminatorsCommand): Promise<any> {
        // console.log('CreateAllRulesForTerminatorsCommand: - 👍🏻👍🏻👍🏻 command ', command)
        const rules = this.rulesAiAssistantRepository.deleteRules()
        // console.log('CreateAllRulesForTerminatorsCommand: - 👍🏻👍🏻👍🏻 rules ', rules)
        return rules
    }

}