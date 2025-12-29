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

    async sendConfirmationEmail(from: string, to: string, subject: string, text: string, html: any): Promise<void> {
        try {
            const result = await this.mailerService.sendMail({from, to, subject, text, html});
            this.logger.log(`✅ Письмо отправлено на ${to}`);
            // console.log('Mailer result:', result);
            return result
        } catch (err) {
            this.logger.error('❌ Ошибка отправки письма:', err.message);
            // console.log('Error details:', err);
        }
    }
}
