import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { DialogAiAssistantRepository } from '../../ai-assistant-dialog-infrastructure/ai-assistant-dialog.repository';
import { DialogAiAssistant, type DialogAiAssistantModelType } from '../../ai-assistant-dialog-domain/ai-assistant-dialog-entity';

export class CreateDialogAiAssistantCommand {
    constructor(
        public dto: { userAId: string, userBId: string },
    ) { }
}

@CommandHandler(CreateDialogAiAssistantCommand)
export class CreateDialogAiAssistantUseCase
    implements ICommandHandler<CreateDialogAiAssistantCommand, string> {
    constructor(
        @InjectModel(DialogAiAssistant.name) private DialogModel: DialogAiAssistantModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private dialogRepository: DialogAiAssistantRepository,
    ) { }
    async execute(command: CreateDialogAiAssistantCommand): Promise<string> {
        const { userAId, userBId } = command.dto
        // console.log('CreateDialogUseCase: - userAId 😡 ', userAId)
        // console.log('CreateDialogUseCase: - userBId 😡 ', userBId)
        // console.log('UsersConversationsService: createConversationsService - userAId, userBId', userAId, userBId);
        const dialog = this.DialogModel.createDialogInstance({
            userAId,
            userBId
        })
        await this.dialogRepository.save(dialog);
        return dialog._id.toString();
    }
}