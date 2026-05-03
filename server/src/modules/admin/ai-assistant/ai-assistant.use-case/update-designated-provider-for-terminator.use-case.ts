import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RulesAiAssistantRepository } from '../ai-assistant-rules/ai-assistant-rules-infrastrucrure/rules-for-ai-assistant.repository';
import { UpdateRulesAiAssistantDto } from '../ai-assistant-rules/ai-assistant-rules-dto/update-all-rules-for-ai-assistants.dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';
import { UpdateProviderForAiAssistantDto } from '../ai-assistant-dto/update-provider-for-ai-assistants.dto';

export class UpdateDesignatedProviderForAiAssistantCommand {
    constructor(
        public id: string,
        public dto: UpdateProviderForAiAssistantDto
    ) { }
}

@CommandHandler(UpdateDesignatedProviderForAiAssistantCommand)
export class UpdateDesignatedProviderForAiAssistantUseCase
    implements ICommandHandler<UpdateDesignatedProviderForAiAssistantCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private usersRepository: UsersRepository,
        private rulesAiAssistantRepository: RulesAiAssistantRepository,
    ) { }
    async execute(command: UpdateDesignatedProviderForAiAssistantCommand): Promise<string> {
        const { id, dto } = command;
        // console.log('UpdateDesignatedProviderForAiAssistantUseCase: - dto 😡 ', dto)
        const isTermik = await this.usersRepository.findUserByIdOrNotFoundFail(dto.id)
        // console.log('UpdateDesignatedProviderForAiAssistantUseCase: - dto 😡 ', dto)
        // console.log('updateMessagesServices: - 👍🏻 msg ', msg)

        isTermik.updateDesignatedProviderAndModelForAssistantData(isTermik.id, dto);
        // console.log('UpdateDesignatedProviderForAiAssistantUseCase: - 🤪🤪🤪 isTermik1', isTermik)

        await this.usersRepository.save(isTermik);

        // console.log('UpdateDesignatedProviderForAiAssistantUseCase: - 🤪🤪🤪 isTermik2', isTermik)
        return isTermik._id.toString();
    }
}