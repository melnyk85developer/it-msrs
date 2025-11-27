import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly config: ConfigService,
    ) { }

    async sendConfirmationEmail(email: string, code: string): Promise<void> {
        const projekt = this.config.get<string>('PROJEKT_NAME');
        const from = this.config.get<string>('MAIL_FROM');
        const subject = `Активация аккаунта на сайте ${projekt}`;
        const url = `${this.config.get<string>('API_URL')}/auth/confirm-email?code=${code}`;

        const html = `
        <div>
            <h1>Для активации аккаунта на сайте ${projekt} перейдите по ссылке:</h1>
            <h2>${code}</h2>
            <p>
            <a href="${url}">Подтвердить регистрацию</a>
            </p>
        </div>
        `;

        try {
            const result = await this.mailerService.sendMail({
                to: email,
                from,
                subject,
                text: code,
                html,
            });
            this.logger.log(`✅ Письмо отправлено на ${email}`);
            // console.log('Mailer result:', result);
        } catch (err) {
            this.logger.error('❌ Ошибка отправки письма:', err.message);
            // console.log('Error details:', err);
        }
    }
}
