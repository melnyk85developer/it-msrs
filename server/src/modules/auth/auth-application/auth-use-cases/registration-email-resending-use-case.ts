import * as uuid from 'uuid';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ConfirmationsCodesService } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { IsBlockedEmailResendingService } from 'src/core/utils/blocked-utilite';
import { EmailService } from 'src/modules/notifications/email.service';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';

export class RegistrationEmailResendingCommand {
    constructor(
        public email: string
    ) { }
}
export type RegistrationEmailResendingResult = {
    done: boolean;
    data: {
        expirationISO: string,
        code: string
    } | null;
    code: number;
    serviceMessage: string;
};
@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase
    implements ICommandHandler<RegistrationEmailResendingCommand, RegistrationEmailResendingResult> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private usersRepository: UsersRepository,
        private emailService: EmailService,
        private confirmationsCodesService: ConfirmationsCodesService,
        private isBlockedEmailResendingService: IsBlockedEmailResendingService,
    ) { }
    async execute(command: RegistrationEmailResendingCommand): Promise<RegistrationEmailResendingResult> {
        // console.log('RegistrationEmailResendingUseCase: - email 😡😡😡', command.email)
        const { email } = command
        const confirmationCode = uuid.v4()
        const date = new Date().toISOString()
        const getUser = await this.usersRepository.findByLoginOrEmail(email)

        if (!getUser) {
            // console.log('RegistrationEmailResendingUseCase: - getUser 😡😡😡', getUser)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_INCORECT_E_MAIL)
        }
        if (getUser && getUser.systemUserData.isEmailConfirmed === true) {
            // console.log('RegistrationEmailResendingUseCase: - getUser 😡😡😡', getUser.systemUserData.isEmailConfirmed)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_EMAIL_ALREADY_CONFIRMED)
        }
        await this.isBlockedEmailResendingService.isBlockedResending({
            getUser,
            field: 'registration',
            date,
            confirmationCode,
            blockMinutes: 40,
            cooldownMinutes: 3,
            windowMinutes: 18,
            maxRequests: 5
        })

        const expirationDate = await this.confirmationsCodesService.createConfirmationsCodesService({
            confirmationCode: confirmationCode,
            isBlocked: false,
            isCooldown: true,
            add: date,
            minutes: 3,
            userId: getUser.id,
            field: 'registration'
        })

        const nameProjekt = `<span style="color: #FEA930; font-size: 18px;">Web</span><span style="color: #15c; font-size: 18px;">Mars</span>`
        const from = `${process.env.PROJEKT_NAME}<${process.env.SMTP_USER}>`
        const to = email
        const subject = `Повторный запрос на активацию аккаунта в проекте ${process.env.PROJEKT_NAME}`
        const text = confirmationCode
        const html = `<div>
                        <h1>Повторный запрос на активацию аккаунта ${process.env.PROJEKT_NAME} перейдите по ссылке</h1>
                        <h2>${confirmationCode}</h2>
                        <p>
                            To finish registration please follow the link below:
                            <a href="${process.env.API_URL}/auth/registration-confirmation?code=${confirmationCode}">Сбросить пароль</a>
                        </p>
                        <button>
                            <a href="${process.env.API_URL}/auth/registration-confirmation?code=${confirmationCode}">Сбросить пароль</a>
                        </button>
                    </div>`

        // const html = mailResendingEmailMessageHTMLDocument(
        //     nameProjekt,
        //     to,
        //     text,
        //     `${process.env.API_URL}/auth/registration-confirmation/${confirmationCode}`
        // )
        const isSendEmail = this.emailService.sendConfirmationEmail(
            from,
            to,
            subject,
            text,
            html
        )
            .catch(() => console.log(`
                Упс, что-то пошло не так во время отправки сообщения на E-Mail: ${email}. Возможно сервис отправки 
                писем перегружен, просим Вас повторить запрос чуть позже.`))


        if (expirationDate) {
            // console.log('AuthService registrationEmailResendingService: - isSendEmail res', isSendEmail)
            // console.log('RegistrationEmailResendingUseCase: - expirationDate res', expirationDate.expirationDate)
            const expirationISO = new Date(expirationDate.expirationDate).toISOString();
            return {
                done: true,
                data: { expirationISO: expirationISO, code: confirmationCode },
                code: INTERNAL_STATUS_CODE.SUCCESS,
                serviceMessage: `Сообщение успешно отправлено на E-Mail: ${email}. Проверьте почту и следуйте дальнейшим инструкциям в письме. ${expirationISO}`
            };
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY)
        }
    }
}