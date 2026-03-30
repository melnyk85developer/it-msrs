import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Multer } from 'multer';
import { MessageAiAssistantRepository } from '../../ai-assistant-infrastrucrure/msg-ai-assistant.repository';
import { UpdateMessageAiAssistantDto } from '../../ai-assistant-dto/update-msg-ai-assistant.dto';


export class UpdateMessageAiAssistantCommand {
    constructor(
        public userId: string,
        public dto: Omit<UpdateMessageAiAssistantDto, 'attachments'>,
        public file?: [Multer.File]
    ) { }
}

@CommandHandler(UpdateMessageAiAssistantCommand)
export class UpdateAiAssistantMessageUseCase
    implements ICommandHandler<UpdateMessageAiAssistantCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private messageAiAssistantRepository: MessageAiAssistantRepository,
    ) { }
    async execute(command: UpdateMessageAiAssistantCommand): Promise<string> {
        const { userId, dto } = command;
        console.log('UpdateAiAssistantMessageUseCase: - userId 😡 ', userId)
        console.log('UpdateAiAssistantMessageUseCase: - dto 😡 ', dto)
        if (userId !== dto.senderId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDEN_TO_UPDATE_YOU_ARE_NOT_A_MEMBER_OF_THIS_MESSAGE)
        }
        const msg = await this.messageAiAssistantRepository.findMessageByIdOrNotFoundFailRepository(dto.msgId)
        // console.log('updateMessagesServices: - 👍🏻 msg ', msg)
        const attachments = []
        msg.updateAiAssistantMessage({
            ...dto,
            attachments
        });
        console.log('UpdateAiAssistantMessageUseCase: updateAiAssistantMessage - 🤪🤪🤪 msg1', msg)
        await this.messageAiAssistantRepository.save(msg);
        console.log('UpdateAiAssistantMessageUseCase: updateAiAssistantMessage - 🤪🤪🤪 msg2', msg)
        return msg._id.toString();
    }
}