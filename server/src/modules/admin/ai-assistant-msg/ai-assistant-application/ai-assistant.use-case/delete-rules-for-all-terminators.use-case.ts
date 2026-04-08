import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RulesAiAssistant, type RulesAiAssistantModelType } from '../../ai-assistant-domain/ai-assistant-global-context.entity';
import { InjectModel } from '@nestjs/mongoose';
import { RulesAiAssistantRepository } from '../../ai-assistant-infrastrucrure/rules-for-ai-assistant.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

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