// email.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly config: ConfigService,
    ) { }

    async sendConfirmationEmail(email: string, code: string): Promise<void> {
        const from = `IT-INCUBATOR <${this.config.get('SMTP_USER')}>`;
        const to = email;
        const subject = `Активация аккаунта на сайте ${this.config.get('PROJEKT_NAME')}`;
        const text = code; // тут именно код, как по заданию

        const url = `${this.config.get('API_URL')}/auth/confirm-email?code=${code}`;
        const html = `
      <div>
        <h1>Для активации аккаунта на сайте ${this.config.get('PROJEKT_NAME')} перейдите по ссылке</h1>
        <h2>${code}</h2>
        <p>
          To finish registration please follow the link below:
          <a href="${url}">Подтвердить регистрацию</a>
        </p>
        <button>
          <a href="${url}">Подтвердить регистрацию</a>
        </button>
      </div>
    `;

        await this.mailerService.sendMail({ from, to, subject, text, html });
    }
}
