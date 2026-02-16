import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from '../../msg-dto/create-msg.dto';
import { isDialogDeletedForUser } from '../../maper/queryMaper';
import { UpdateDialogCommand } from 'src/modules/user-messages/dialog/dialog-application/dialog-use-cases/update-dialog.use-case';
import { Message, type MessageModelType } from '../../msg-domain/msg-entity';
import { DialogRepository } from 'src/modules/user-messages/dialog/dialog-infrastructure/dialog.repository';
import { MessageRepository } from '../../msg-infrastructure/msg.repository';
import { MessageOneViewDto } from '../../msg-api/viev-dto-msg/msg-one.view-dto';
import { CreateDialogCommand } from 'src/modules/user-messages/dialog/dialog-application/dialog-use-cases/create-dialog.use-case';

export class CreateMessageCommand {
    constructor(
        public dto: Omit<CreateMessageDto, 'dialogId'>,
        public attachments?: [Multer.File]
    ) { }
}

@CommandHandler(CreateMessageCommand)
export class CreateMessageUseCase
    implements ICommandHandler<CreateMessageCommand, MessageOneViewDto> {
    constructor(
        @InjectModel(Message.name) private MessageModel: MessageModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private messageRepository: MessageRepository,
        private dialogRepository: DialogRepository,
    ) { }
    async execute(command: CreateMessageCommand): Promise<MessageOneViewDto> {
        const { localId, senderId, receiverId, message, replyToMessageId } = command.dto
        const { dto } = command
        // console.log('createMessageServices: - 👍🏻 dto ', dto)
        const isDialog = await this.dialogRepository.findOneDialogBySenderIdOrReceiverIdRepository(
            senderId,
            receiverId
        )
        if (isDialog) {
            // console.log('createMessageServices: - 😜😜😜 isDialog', isDialog)
            // console.log('createMessageServices: - 😡😡😡, senderId, receiverId', senderId, receiverId)
            if (isDialogDeletedForUser(isDialog.meta, senderId)) {
                // console.log('createMessageServices: - 😡😡😡, isDialogDeletedForUser(isDialog.meta, senderId)', isDialogDeletedForUser(isDialog.meta, senderId))
                await this.commandBus.execute<UpdateDialogCommand, string>(
                    new UpdateDialogCommand(
                        isDialog.id,
                        senderId
                    )
                );
            }
            if (isDialogDeletedForUser(isDialog.meta, receiverId)) {
                // console.log('createMessageServices: - 😡😡😡, isDialogDeletedForUser(isDialog.meta, receiverId)', isDialogDeletedForUser(isDialog.meta, receiverId))
                await this.commandBus.execute<UpdateDialogCommand, string>(
                    new UpdateDialogCommand(
                        isDialog.id,
                        receiverId
                    )
                );
            }
            const msg = this.MessageModel.createMessageInstance(
                {
                    ...dto,
                    message,
                    senderId: senderId,
                    receiverId: receiverId,
                    // read: Boolean(read),
                    dialogId: isDialog.id,
                    replyToMessageId: replyToMessageId ? replyToMessageId : null,
                }
            )
            // console.log('createMessageServices: msg1', msg)
            await this.messageRepository.save(msg);
            // console.log('createMessageServices: msg2', msg)
            return MessageOneViewDto.mapToOneMessageView(msg, localId)
        } else {
            // console.log('createMessageServices: - 😡😡😡, senderId, receiverId', senderId, receiverId)
            const newUserDialogId = await this.commandBus.execute<CreateDialogCommand, string>(
                new CreateDialogCommand({ userAId: senderId, userBId: receiverId })
            );
            // console.log('createMessageServices: newUserDialogId', newUserDialogId)
            const msg = this.MessageModel.createMessageInstance(
                {
                    ...dto,
                    message,
                    senderId: senderId,
                    receiverId: receiverId,
                    // read: Boolean(read),
                    dialogId: newUserDialogId,
                    replyToMessageId: null,
                }
            )
            // console.log('createMessageServices: msg1', msg)
            await this.messageRepository.save(msg);
            // console.log('createMessageServices: msg2', msg)
            return MessageOneViewDto.mapToOneMessageView(msg, localId)
        }
    }
}