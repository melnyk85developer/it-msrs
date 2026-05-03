import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RulesAiAssistantRepository } from '../ai-assistant-rules-infrastrucrure/rules-for-ai-assistant.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { UpdateRulesAiAssistantDto } from '../ai-assistant-rules-dto/update-all-rules-for-ai-assistants.dto';

export class UpdateRulesAiAssistantCommand {
    constructor(public dto: UpdateRulesAiAssistantDto) { }
}

@CommandHandler(UpdateRulesAiAssistantCommand)
export class UpdateAiAssistantRulesUseCase
    implements ICommandHandler<UpdateRulesAiAssistantCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private rulesAiAssistantRepository: RulesAiAssistantRepository,
    ) { }
    async execute(command: UpdateRulesAiAssistantCommand): Promise<string> {
        const { dto } = command;
        console.log('UpdateAiAssistantRulesUseCase: - dto 😡 ', dto)
        const rules = await this.rulesAiAssistantRepository.findRuleByRuleIdOrNotFoundFailRepository(dto.id)
        // console.log('updateMessagesServices: - 👍🏻 msg ', msg)

        rules.updateAiAssistantMessage(dto);
        console.log('UpdateAiAssistantRulesUseCase: - 🤪🤪🤪 msg1', rules)
        await this.rulesAiAssistantRepository.save(rules);
        console.log('UpdateAiAssistantRulesUseCase: - 🤪🤪🤪 msg2', rules)
        return rules._id.toString();
    }
}