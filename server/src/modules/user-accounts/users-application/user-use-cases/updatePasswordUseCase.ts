import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { UsersRepository } from "../../users-infrastructure/users.repository";
import { CryptoService } from "../crypto.service";
import { ConfirmationRepository } from "src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository";
import { RessetPasswordDto } from "../../users-dto/resset-password-dto";

export class UpdatePasswordCommand {
    constructor(public readonly dto: RessetPasswordDto) { }
}
export type UpdatePasswordResult = {
    done: boolean;
    data: {
        expirationISO: string,
        code: string
    } | null;
    code: number;
    serviceMessage: string;
};
@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordUseCase
    implements ICommandHandler<UpdatePasswordCommand, UpdatePasswordResult> {
    constructor(
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
        private confirmationRepository: ConfirmationRepository,
    ) { }

    async execute(command: UpdatePasswordCommand) {
        const { password, code } = command.dto;
        // console.log('SendPasswordRecoveryEmailUseCase - email 👽 😡 👽', email)
        const passwordHash = await this.cryptoService.createPasswordHash(password);
        const confirmation = await this.confirmationRepository.findByCodeConfirmationRepository(code)
        if (confirmation) {
            // console.log('updatePasswordService: - confirmation', confirmation)
            const user = await this.usersRepository.findUserByIdOrNotFoundFail(confirmation.userId)
            if (user) {
                if (new Date().toISOString() > confirmation.expirationDate) {
                    // console.log('UsersService confirmationCode: - Код протух: ', confirmation.expirationDate)
                    throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_EXPIRATION_TIME_PASSED)
                } else {
                    user.updateUserPassword(passwordHash, confirmation.userId)
                    await this.usersRepository.save(user);
                    return {
                        done: true,
                        data: user.id,
                        code: INTERNAL_STATUS_CODE.SUCCESS,
                        serviceMessage: `Пароль успешно обновлен!`
                    };
                }
            } else {
                throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND)
            }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND)
        }
    }
}