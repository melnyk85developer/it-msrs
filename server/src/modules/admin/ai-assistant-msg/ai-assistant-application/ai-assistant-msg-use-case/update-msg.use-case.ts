import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Multer } from 'multer';
import { MessageAiAssistantRepository } from '../../ai-assistant-infrastrucrure/msg-ai-assistant.repository';
import { UpdateMessageAiAssistantDto } from '../../ai-assistant-dto/update-msg-ai-assistant.dto';

export class UpdateMessageCommand {
    constructor(
        public userId: string,
        public dto: Omit<UpdateMessageAiAssistantDto, 'attachments'>,
        public file?: [Multer.File]
    ) { }
}

@CommandHandler(UpdateMessageCommand)
export class UpdateMessageUseCase
    implements ICommandHandler<UpdateMessageCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private messageRepository: MessageAiAssistantRepository,
    ) { }
    async execute(command: UpdateMessageCommand): Promise<string> {
        const { userId, dto } = command;
        // console.log('PostForProfileUseCase: - userId 😡 ', userId)
        if (userId !== dto.senderId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDEN_TO_UPDATE_YOU_ARE_NOT_A_MEMBER_OF_THIS_MESSAGE)
        }
        const msg = await this.messageRepository.findMessageByIdOrNotFoundFailRepository(dto.msgId)
        // console.log('updateMessagesServices: - 👍🏻 msg ', msg)
        const attachments = []
        msg.updateMessage({
            ...dto,
            attachments
        });
        // console.log('updateMessagesServices: - 🤪🤪🤪 msg1', msg)
        await this.messageRepository.save(msg);
        // console.log('updateMessagesServices: - 🤪🤪🤪 msg2', msg)
        return msg._id.toString();
    }
}