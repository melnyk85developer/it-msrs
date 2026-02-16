import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { MessageRepository } from '../../msg-infrastructure/msg.repository';
import { UpdateMessageReadDomainDto } from '../../msg-dto/update-msg-read-domain.dto';

export class UpdateReadMsgCommand {
    constructor(
        public userId: string,
        public dto: UpdateMessageReadDomainDto
    ) { }
}

@CommandHandler(UpdateReadMsgCommand)
export class UpdateReadMsgUseCase
    implements ICommandHandler<UpdateReadMsgCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private messageRepository: MessageRepository,
    ) { }
    async execute(command: UpdateReadMsgCommand): Promise<string> {
        const { userId, dto } = command;
        // console.log('updateReadServices: - 👍🏻 msg ', dto.msgId)
        const msg = await this.messageRepository.findMessageByIdOrNotFoundFailRepository(dto.msgId)
        // console.log('updateReadServices: - 👍🏻 msg 1', msg)
        if (userId !== msg.receiverId && userId !== msg.senderId) {
            // console.log('updateReadServices: - 👍🏻 userId !== msg.receiverId && userId !== msg.senderId 2', userId !== msg.receiverId && userId !== msg.senderId)
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDEN_TO_UPDATE_YOU_ARE_NOT_A_MEMBER_OF_THIS_MESSAGE)
        }
        // console.log('updateReadServices: - 👍🏻 msg 3', msg)
        msg.updateRead(dto);
        // console.log('updateReadServices: - 👍🏻 msg 4', msg)
        await this.messageRepository.save(msg);
        // console.log('updateReadServices: - 👍🏻 msg 5', msg)
        return msg._id.toString();
    }
}