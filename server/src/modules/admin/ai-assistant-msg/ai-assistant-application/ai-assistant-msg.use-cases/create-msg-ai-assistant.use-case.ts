import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateDialogCommand } from 'src/modules/user-messages/dialog/dialog-application/dialog-use-cases/update-dialog.use-case';
import { AiAssistantMessageOneViewDto } from '../../api-ai-assistant-msg/viev-dto-msg/msg-one.view-dto';
import { MessageAiAssistantRepository } from '../../ai-assistant-infrastrucrure/msg-ai-assistant.repository';
import { isDialogAiAssistantDeletedForUser } from '../../ai-assistant-maper/queryMaper';
import { CreatePromptAiDto } from '../../ai-assistant-dto/create-prompt-ai-assistant.dto';
import { DialogAiAssistantRepository } from 'src/modules/admin/ai-assistant-dialog/ai-assistant-dialog-infrastructure/ai-assistant-dialog.repository';
import { CreateDialogAiAssistantCommand } from 'src/modules/admin/ai-assistant-dialog/ai-assistant-dialog-application/ai-assistant-dialog-use-cases/create-ai-assistant-dialog.use-case';
import { AiAssistantMessage, type AiAssistantMessageModelType } from '../../ai-assistant-domain/ai-assistant-msg.entity';

export class CreateMessageAiAssistantCommand {
    constructor(
        public dto: Omit<CreatePromptAiDto, 'dialogId'>,
        // public attachments?: [Multer.File]
    ) { }
}

@CommandHandler(CreateMessageAiAssistantCommand)
export class CreateMessageAiAssistantUseCase
    implements ICommandHandler<CreateMessageAiAssistantCommand, AiAssistantMessageOneViewDto> {
    constructor(
        @InjectModel(AiAssistantMessage.name) private AiAssistantMessageModel: AiAssistantMessageModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private messageAiAssistantRepository: MessageAiAssistantRepository,
        private dialogAiAssistantRepository: DialogAiAssistantRepository,
    ) { }
    async execute(command: CreateMessageAiAssistantCommand): Promise<AiAssistantMessageOneViewDto> {
        // console.log('CreateMessageAiAssistantUseCase: - 👍🏻👍🏻👍🏻 command ', command)

        const { localId, senderId, receiverId, prompt } = command.dto
        const { dto } = command
        // console.log('CreateMessageAiAssistantUseCase: - 👍🏻 dto ', dto)
        const isDialog = await this.dialogAiAssistantRepository.findOneDialogBySenderIdOrReceiverIdRepository(
            senderId,
            receiverId
        )
        if (isDialog) {
            // console.log('CreateMessageAiAssistantUseCase: - 😜😜😜 isDialog', isDialog)
            // console.log('CreateMessageAiAssistantUseCase: - 😡😡😡, senderId, receiverId', senderId, receiverId)
            if (isDialogAiAssistantDeletedForUser(isDialog.meta, senderId)) {
                // console.log('CreateMessageAiAssistantUseCase: - 😡😡😡, isDialogDeletedForUser(isDialog.meta, senderId)', isDialogAiAssistantDeletedForUser(isDialog.meta, senderId))
                await this.commandBus.execute<UpdateDialogCommand, string>(
                    new UpdateDialogCommand(
                        isDialog.id,
                        senderId
                    )
                );
            }
            if (isDialogAiAssistantDeletedForUser(isDialog.meta, receiverId)) {
                // console.log('CreateMessageAiAssistantUseCase: - 😡😡😡, isDialogDeletedForUser(isDialog.meta, receiverId)', isDialogAiAssistantDeletedForUser(isDialog.meta, receiverId))
                await this.commandBus.execute<UpdateDialogCommand, string>(
                    new UpdateDialogCommand(
                        isDialog.id,
                        receiverId
                    )
                );
            }
            const msg = this.AiAssistantMessageModel.createAiAssistantMessageInstance(
                {
                    ...dto,
                    content: prompt,
                    senderId: senderId,
                    receiverId: receiverId,
                    dialogId: isDialog.id
                }
            )
            // console.log('CreateMessageAiAssistantUseCase: msg1', msg)
            await this.messageAiAssistantRepository.save(msg);
            // console.log('CreateMessageAiAssistantUseCase: msg2', msg)
            return AiAssistantMessageOneViewDto.mapToOneAiAssistantMessageView(msg, localId)
        } else {
            // console.log('CreateMessageAiAssistantUseCase: - 😡😡😡, senderId, receiverId', senderId, receiverId)
            const newUserDialogId = await this.commandBus.execute<CreateDialogAiAssistantCommand, string>(
                new CreateDialogAiAssistantCommand({ userAId: senderId, userBId: receiverId })
            );
            // console.log('CreateMessageAiAssistantUseCase: newUserDialogId', newUserDialogId)
            const msg = this.AiAssistantMessageModel.createAiAssistantMessageInstance(
                {
                    ...dto,
                    content: prompt,
                    senderId: senderId,
                    receiverId: receiverId,
                    dialogId: newUserDialogId
                }
            )
            // console.log('CreateMessageAiAssistantUseCase: msg1', msg)
            await this.messageAiAssistantRepository.save(msg);
            // console.log('CreateMessageAiAssistantUseCase: msg2', msg)
            return AiAssistantMessageOneViewDto.mapToOneAiAssistantMessageView(msg, localId)
        }
    }
}