import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Dialog, type DialogModelType } from '../../dialog-domain/dialog-entity';
import { DialogRepository } from '../../dialog-infrastructure/dialog.repository';

export class CreateDialogCommand {
    constructor(
        public dto: { userAId: string, userBId: string },
    ) { }
}

@CommandHandler(CreateDialogCommand)
export class CreateDialogUseCase
    implements ICommandHandler<CreateDialogCommand, string> {
    constructor(
        @InjectModel(Dialog.name) private DialogModel: DialogModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private dialogRepository: DialogRepository,
    ) { }
    async execute(command: CreateDialogCommand): Promise<string> {
        const { userAId, userBId } = command.dto
        // console.log('CreateDialogUseCase: - userAId 😡 ', userAId)
        // console.log('CreateDialogUseCase: - userBId 😡 ', userBId)
        // console.log('UsersConversationsService: createConversationsService - userAId, userBId', userAId, userBId);
        const dialog = this.DialogModel.createDialogInstance({
            userAId,
            userBId
        })
        // console.log('CreateMessageAiAssistantUseCase: - 😡😡😡, dialog1', dialog)
        await this.dialogRepository.save(dialog);
        // console.log('CreateMessageAiAssistantUseCase: - 😡😡😡, dialog2', dialog)
        return dialog._id.toString();
    }
}