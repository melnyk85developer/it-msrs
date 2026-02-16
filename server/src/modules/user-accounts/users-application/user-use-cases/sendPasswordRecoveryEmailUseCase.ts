import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import * as uuid from 'uuid';
import { EmailService } from "src/modules/notifications/email.service";
import { ConfirmationsCodesService } from "src/modules/confirmationsCodes/confirmations-application/confirmations.service";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { IsBlockedEmailResendingService } from "src/core/utils/blocked-utilite";
import { UsersRepository } from "../../users-infrastructure/users.repository";
import { User } from "../../users-domain/user.entity";

export class SendPasswordRecoveryEmailCommand {
    constructor(public readonly email: string) { }
}
export type SendPasswordRecoveryEmailResult = {
    done: boolean;
    data: {
        expirationISO: string,
        code: string
    } | null;
    code: number;
    serviceMessage: string;
};
@CommandHandler(SendPasswordRecoveryEmailCommand)
export class SendPasswordRecoveryEmailUseCase
    implements ICommandHandler<SendPasswordRecoveryEmailCommand, SendPasswordRecoveryEmailResult> {
    constructor(
        private usersRepository: UsersRepository,
        private isBlockedEmailResendingService: IsBlockedEmailResendingService,
        private emailService: EmailService,
        private confirmationsCodesService: ConfirmationsCodesService,
    ) { }

    async execute(command: SendPasswordRecoveryEmailCommand) {
        const { email } = command;
        // console.log('SendPasswordRecoveryEmailUseCase - email 👽 😡 👽', email)
        const confirmationCode = uuid.v4();
        const date = new Date().toISOString()
        const getUser = await this._getUserByEmailService(email);
        // console.log('SendPasswordRecoveryEmailUseCase - getUser 👽 😡 👽', getUser)

        if (!getUser) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        await this.isBlockedEmailResendingService.isBlockedResending({
            getUser,
            field: 'password',
            date,
            confirmationCode,
            blockMinutes: 40,
            cooldownMinutes: 3,
            windowMinutes: 18,
            maxRequests: 5
        })

        const nameProjekt = `<span style="margin: -2px 0 0 0; color: #FEA930; font-size: 18px;">Web</span><span style="margin: -2px 0 0 0; color: #15c; font-size: 18px;">Mars</span>`
        const from = `${process.env.PROJEKT_NAME}<${process.env.SMTP_USER}>`
        const to = email
        const subject = `Сброс пароля на проекте ${process.env.PROJEKT_NAME}`
        const text = confirmationCode
        const html =
            `<div>
                    <h1>Сбросс пароля на ${process.env.PROJEKT_NAME} перейдите по ссылке</h1>
                    <h2>${confirmationCode}</h2>
                    <p>
                        To finish registration please follow the link below:
                        <a href="${process.env.API_URL}/auth/new-password">Сбросить пароль</a>
                    </p>
                    <button>
                        <a href="${process.env.API_URL}/auth/new-password">Сбросить пароль</a>
                    </button>
                </div>`


        // const html = resetPasswordEmailMessageHTMLDocument(nameProjekt, to, text, `${process.env.CLIENT_URL}/new-password?code=${confirmationCode}`, getUser)

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

        const expirationDate = await this.confirmationsCodesService.createConfirmationsCodesService({
            confirmationCode: confirmationCode,
            isBlocked: false,
            isCooldown: true,
            add: date,
            minutes: 3,
            field: 'password',
            userId: getUser.id,
        })
        if (expirationDate) {
            // console.log('UsersService ressetPasswordService: - isSendEmail res 200', isSendEmail)
            // console.log('UsersService ressetPasswordService: - isSendEmail res 200', expirationDate)
            const expirationISO = new Date(expirationDate.expirationDate).toISOString();
            return {
                done: true,
                data: { expirationISO: expirationISO, code: confirmationCode },
                code: INTERNAL_STATUS_CODE.SUCCESS,
                serviceMessage: `Сообщение успешно отправлено на E-Mail: ${email}. Проверьте почту и следуйте дальнейшим инструкциям в письме. ${expirationISO}`
            };
        } else {
            // console.log('UNPROCESSABLE_ENTITY: - isSendEmail', isSendEmail)
            throw new DomainException(INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY)
        }
    }
    async _getUserByEmailService(email: string): Promise<User | null> {
        return await this.usersRepository.findByLoginOrEmail(email)
    }
}