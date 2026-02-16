import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { SessionsRepository } from '../../sessions-infrastructure/session.repository';

export class DeleteAllSessionCommand {
    constructor(
        public userId: string,
        public deviceId: string
    ) { }
}

@CommandHandler(DeleteAllSessionCommand)
export class DeleteAllSessionUseCase
    implements ICommandHandler<DeleteAllSessionCommand, number> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private sessionsRepository: SessionsRepository
    ) { }
    async execute(command: DeleteAllSessionCommand): Promise<number> {
        const { userId, deviceId } = command;

        const isSessions = await this.sessionsRepository.findAllSessionsByUserIdOrNotFoundFail(userId);
        if (isSessions && isSessions.length > 0) {
            for (let i = 0; isSessions.length > i; i++) {
                if (isSessions[i].deviceId !== deviceId) {
                    await this.sessionsRepository.deleteSession(userId, deviceId);
                }
            }
        }
        // console.log('SessionService deleteAllSessionsServices - isSessions.length', isSessions.length)
        return isSessions.length
    }
}