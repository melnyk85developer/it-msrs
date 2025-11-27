import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.get('SMTP_HOST'),
                    port: Number(config.get('SMTP_PORT')),
                    secure: false, // Gmail uses STARTTLS, not SSL
                    auth: {
                        user: config.get('SMTP_USER'),
                        pass: config.get('SMTP_PASSWORD'),
                    },
                },
                defaults: {
                    from: config.get('MAIL_FROM'),
                },
            }),
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class NotificationsModule { }
