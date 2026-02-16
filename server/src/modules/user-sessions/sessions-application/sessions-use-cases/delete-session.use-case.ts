import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { SessionsRepository } from '../../sessions-infrastructure/session.repository';
import { DeleteResult } from 'mongoose';

export class DeleteSessionCommand {
    constructor(
        public userId: string,
        public deviceId: string
    ) { }
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
    implements ICommandHandler<DeleteSessionCommand, DeleteResult> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private sessionsRepository: SessionsRepository
    ) { }
    async execute(command: DeleteSessionCommand): Promise<DeleteResult> {
        const { userId, deviceId } = command;

        const session = await this.sessionsRepository.findSessionByDeviceIdOrNotFoundFail(deviceId)
        // console.log('SessionService deleteSessionsByDeviceIdServices - session', session)
        if (session && String(session.userId) !== String(userId)) {
            // console.log('UsersSessionService deleteSessionsByDeviceIdServices - if', userSession.userId, userId)
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION)
        } else {
            const isDelete = await this.sessionsRepository.deleteSession(userId, deviceId);
            // console.log('UsersSessionService deleteSessionsByDeviceIdServices - isDelete', isDelete)
            if (isDelete) {
                return isDelete
            } else {
                throw new DomainException(INTERNAL_STATUS_CODE.SESSION_DELETION_ERROR)
            }
        }
    }
}