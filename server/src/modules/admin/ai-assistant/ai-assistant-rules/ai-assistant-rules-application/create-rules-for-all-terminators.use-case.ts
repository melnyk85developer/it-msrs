import { CommandHandler, ICommandHandler, CommandBus, EventBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { CreateAllRulesAiAssistantDto } from '../ai-assistant-rules-dto/create-all-rules-for-ai-assistants.dto';
import { RulesAiAssistant, type RulesAiAssistantModelType } from '../ai-assistant-rules-damain/ai-assistant-global-context.entity';
import { RulesAiAssistantRepository } from '../ai-assistant-rules-infrastrucrure/rules-for-ai-assistant.repository';

export class CreateAllRulesForTerminatorsCommand {
    constructor(public readonly dto: CreateAllRulesAiAssistantDto) { }
}

@CommandHandler(CreateAllRulesForTerminatorsCommand)
export class CreateAllRulesForTerminatorsUseCase implements ICommandHandler<CreateAllRulesForTerminatorsCommand> {
    constructor(
        @InjectModel(RulesAiAssistant.name) private RulesAiAssistantModelModel: RulesAiAssistantModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private rulesAiAssistantRepository: RulesAiAssistantRepository,
    ) { }

    async execute(command: CreateAllRulesForTerminatorsCommand): Promise<any> {
        console.log('CreateAllRulesForTerminatorsCommand: - 👍🏻👍🏻👍🏻 command ', command)
        const { 
            // globalRules, 
            // currentMission, 
            // projectContext, 
            // employmentContext 
        } = command.dto
        const { dto } = command

        const rules = this.RulesAiAssistantModelModel.createRulesAiAssistantInstance(command.dto)
        console.log('CreateAllRulesForTerminatorsCommand: - 👍🏻👍🏻👍🏻 command ', command)
        await this.rulesAiAssistantRepository.save(rules)
        return rules
    }

}