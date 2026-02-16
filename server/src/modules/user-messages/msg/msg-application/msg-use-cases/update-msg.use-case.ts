import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { UpdateMessageDto } from '../../msg-dto/update-msg.dto';
import { Multer } from 'multer';
import { MessageRepository } from '../../msg-infrastructure/msg.repository';

export class UpdateMessageCommand {
    constructor(
        public userId: string,
        public dto: Omit<UpdateMessageDto, 'attachments'>,
        public file?: [Multer.File]
    ) { }
}

@CommandHandler(UpdateMessageCommand)
export class UpdateMessageUseCase
    implements ICommandHandler<UpdateMessageCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private messageRepository: MessageRepository,
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
            attachments,
            replyToMessageId: dto.replyToMessageId ? dto.replyToMessageId : null
        });
        // console.log('updateMessagesServices: - 🤪🤪🤪 msg1', msg)
        await this.messageRepository.save(msg);
        // console.log('updateMessagesServices: - 🤪🤪🤪 msg2', msg)
        return msg._id.toString();
    }
}