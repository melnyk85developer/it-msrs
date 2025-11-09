// notifications.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule, // чтобы ConfigService был доступен
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.get('SMTP_HOST'),
                    port: Number(config.get('SMTP_PORT')),
                    secure: false, // true если SMTPS
                    auth: {
                        user: config.get('SMTP_USER'),
                        pass: config.get('SMTP_PASSWORD'),
                    },
                },
                defaults: {
                    from: config.get('DEFAULT_FROM') || `"${config.get('PROJEKT_NAME')}" <${config.get('SMTP_USER')}>`,
                },
                template: {
                    // опционально: если используешь шаблоны
                    dir: join(__dirname, 'templates'),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class NotificationsModule { }