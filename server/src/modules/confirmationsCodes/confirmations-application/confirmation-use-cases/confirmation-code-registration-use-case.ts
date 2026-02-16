import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ConfirmationRepository } from 'src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository';
import { User } from 'src/modules/user-accounts/users-domain/user.entity';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';

export class ConfirmationCodeRegistrationCommand {
    constructor(public confirmationCode: string) { }
}
export type ConfirmationCodeRegistrationResult = {
    done: boolean;
    data: User;
    code: number;
    serviceMessage: string;
};
@CommandHandler(ConfirmationCodeRegistrationCommand)
export class ConfirmationCodeRegistrationUseCase
    implements ICommandHandler<ConfirmationCodeRegistrationCommand, ConfirmationCodeRegistrationResult> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private usersRepository: UsersRepository,
        private confirmationRepository: ConfirmationRepository
    ) { }
    async execute(command: ConfirmationCodeRegistrationCommand): Promise<ConfirmationCodeRegistrationResult> {
        const { confirmationCode } = command
        // console.log('UsersService confirmationCode: - сonfirmation', confirmationCode)
        const isConfirmationCode = await this.confirmationRepository.findByCodeConfirmationRepository(confirmationCode)
        // console.log('UsersService confirmationCode: - isConfirmationCode', isConfirmationCode)
        if (isConfirmationCode) {
            if (new Date().toISOString() > isConfirmationCode.expirationDate) {
                // console.log('UsersService confirmationCode: - EXPIRATION', isConfirmationCode.expirationDate)
                throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_EXPIRATION_TIME_PASSED)
            } else {
                const user = await this.usersRepository.findUserByIdOrNotFoundFail(isConfirmationCode.userId);
                user.makeUpdatedConfirmedAccount(isConfirmationCode.userId);
                // console.log('UsersService: makeUpdatedConfirmedAccount - user1 😡 ', user)
                await this.usersRepository.save(user);
                // console.log('UsersService: makeUpdatedConfirmedAccount - user2 😡 ', user)
                return {
                    done: true,
                    data: user,
                    code: INTERNAL_STATUS_CODE.SUCCESS,
                    serviceMessage: ``
                };
            }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_CONFIRMATION_CODE)
        }
    }
}