import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DialogRepository } from '../../dialog-infrastructure/dialog.repository';

export class UpdateDialogCommand {
    constructor(
        public dialogId: string,
        public userId: string
    ) { }
}

@CommandHandler(UpdateDialogCommand)
export class UpdateDialogUseCase
    implements ICommandHandler<UpdateDialogCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private dialogRepository: DialogRepository,
    ) { }
    async execute(command: UpdateDialogCommand): Promise<string> {
        const { dialogId, userId } = command;
        // console.log('PostForProfileUseCase: - dialogId 😡 ', dialogId)
        // console.log('PostForProfileUseCase: - userId 😡 ', userId)

        // console.log('updateDialogService: dialogId, userId', dialogId, userId);
        const isDialog = await this.dialogRepository.findDialogByIdOrNotFoundFailRepository(dialogId)
        // console.log('updateDialogService: dialogId, userId', dialogId, userId);
        isDialog.updateMarkDialogDeleted(dialogId, userId)
        // console.log('updateDialogService: dialogId, userId', dialogId, userId);
        await this.dialogRepository.save(isDialog);
        // console.log('updateDialogService: dialogId, userId', dialogId, userId);
        return isDialog.id.toString();
    }
}