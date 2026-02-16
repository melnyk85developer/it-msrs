import * as uuid from 'uuid';
import { UsersRepository } from '../../../user-accounts/users-infrastructure/users.repository';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { EmailService } from 'src/modules/notifications/email.service';
import { CreateUserDto } from 'src/modules/user-accounts/users-dto/create-user.dto';
import { ConfirmationsCodesService } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/modules/user-accounts/users-application/user-use-cases/create-user.use-case';

export class UserRegistrationCommand {
    constructor(
        public dto: Omit<CreateUserDto, 'createdAt' | 'updatedAt' | 'deletedAt'>, public avatar: Multer.File | null
    ) { }
}
export type UserRegistrationResult = {
    done: boolean;
    data: { id: string; code: any; };
    code: number;
    serviceMessage: string;
};
@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase
    implements ICommandHandler<UserRegistrationCommand, UserRegistrationResult> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,

        private usersRepository: UsersRepository,
        private confirmationsCodesService: ConfirmationsCodesService,
        private emailService: EmailService,
    ) { }
    async execute(command: UserRegistrationCommand): Promise<UserRegistrationResult> {
        // console.log('UserRegistrationUseCase - dto 😡😡', command.dto)
        // console.log('UserRegistrationUseCase - avatar 👽 😡 👽', command.avatar)
        const { dto, avatar } = command
        const confirmationCode = uuid.v4()
        const date = new Date()
        // const fileName = avatar ? await this.filesService.createAvatarFile(avatar) : null;
        // console.log('FilesService: createFile - fileName 👽 😡 👽', fileName)
        // const createdUserId = await this.usersService.createUserService(dto, fileName);

        const createdUserId = await this.commandBus.execute<CreateUserCommand, string>(
            new CreateUserCommand(dto, avatar),
        );
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(createdUserId);
        // console.log('UserRegistrationUseCase: - user 😡 ', user)
        await this.usersRepository.save(user);

        const from = `IT-INCUBATOR PROJECT<${process.env.SMTP_USER}>`
        const to = user.accountData.email
        const subject = `Активация аккаунта на сайте ${process.env.PROJEKT_NAME}`
        const text = confirmationCode
        const html =
            `<div>
                    <h1>Для активации аккаунта на сайте ${process.env.PROJEKT_NAME} перейдите по ссылке</h1>
                    <h2>${confirmationCode}</h2>
                    <p>
                        To finish registration please follow the link below:
                        <a href="${process.env.API_URL}/auth/registration-confirmation?code=${confirmationCode}">Подтвердить регистрацию</a>
                    </p>
                    <button>
                        <a href="${process.env.API_URL}/auth/registration-confirmation?code=${confirmationCode}">Подтвердить регистрацию</a>
                    </button>
                </div>`

        // <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>

        const isSendEmail = this.emailService.sendConfirmationEmail(
            from,
            to,
            subject,
            text,
            html
        )
            .catch(() => console.log(`
                Упс, что-то пошло не так во время отправки сообщения на E-Mail: ${to}. Возможно сервис отправки 
                писем перегружен, просим Вас повторить запрос чуть позже.`))

        const isCreateConfirmation = await this.confirmationsCodesService.createConfirmationsCodesService(
            {
                confirmationCode: confirmationCode,
                isBlocked: false,
                isCooldown: true,
                add: date.toISOString(),
                minutes: 3,
                userId: user.id,
                field: 'registration'
            }
        )
        if (isCreateConfirmation) {
            // console.log('UserRegistrationUseCase: - isSendEmail 😡 ', isSendEmail)
            // console.log('UserRegistrationUseCase: - isCreateConfirmation 😡 ', isCreateConfirmation)
            // console.log('UserRegistrationUseCase: - user._id.toString(); 😡 ', user._id.toString())
            // return user._id.toString()
            return {
                done: true,
                data: { id: user._id.toString(), code: confirmationCode },
                code: INTERNAL_STATUS_CODE.SUCCESS,
                serviceMessage: `Сообщение успешно отправлено на E-Mail: ${to}. Проверьте почту и следуйте дальнейшим инструкциям в письме.`
            };
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY)
        }
    }
}