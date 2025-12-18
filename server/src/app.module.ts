import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { CoreModule } from './core/core.module';
import { UserAccountsModule } from './modules/user.accounts/user-accounts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TokenModule } from './modules/tokens/token.module';
import { SessionModule } from './modules/usersSessions/sessions.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SuccessMessageInterceptor } from './core/interceptors/successMessageInterceptor';
import { FilesModule } from './modules/files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import * as dotenv from 'dotenv'

dotenv.config({ quiet: true });

@Module({
    imports: [
        // 1. Настраиваем ConfigModule ПЕРВЫМ
        ConfigModule.forRoot({
            isGlobal: true,
            // Логика выбора файла правильная, оставляем, но она будет работать в связке
            envFilePath: process.env.NODE_ENV === 'test' ? '.test.env' : '.development.env'
        }),
        // 2. Mongoose подключаем АСИНХРОННО. 
        // Он будет ждать, пока ConfigModule прочитает нужный файл.
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                // Читаем URL базы из переменных, а не хардкодим здесь
                uri: configService.get<string>('DB_URL'),
            }),
        }),

        ServeStaticModule.forRoot({
            rootPath: path.join(process.cwd(), 'static'),
            serveRoot: '/',
        }),
        NotificationsModule,
        UserAccountsModule,
        BloggersPlatformModule,
        TestingModule,
        CoreModule,
        TokenModule,
        SessionModule,
        FilesModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: SuccessMessageInterceptor,
        },
    ],
})
export class AppModule { }