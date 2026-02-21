import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv'
import path from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { CoreModule } from './core/core.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TokenModule } from './modules/tokens/token.module';
import { SessionModule } from './modules/user-sessions/sessions.module';
import { SuccessMessageInterceptor } from './core/interceptors/successMessageInterceptor';
import { FilesModule } from './modules/files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PostForProfileModule } from './modules/posts-for-profile/posts-for-profile.module';
import { PhotoModule } from './modules/gallery/photos/photos.module';
import { MessagesModule } from './modules/user-messages/msg.module';
import { DialogsModule } from './modules/user-messages/dialog/dialog.module';
import { LikeModule } from './modules/likes/likes.module';

dotenv.config({ quiet: true });

@Module({
    imports: [
        // 1. Настраиваем ConfigModule ПЕРВЫМ
        ConfigModule.forRoot({
            isGlobal: true,
            // Логика выбора файла правильная, оставляем, но она будет работать в связке
            envFilePath: process.env.NODE_ENV === 'development' ? '.dev.env' : '.test.env'
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
        PostForProfileModule,
        PhotoModule,
        MessagesModule,
        DialogsModule,
        TestingModule,
        CoreModule,
        TokenModule,
        SessionModule,
        FilesModule,
        LikeModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: SuccessMessageInterceptor,
        },
    ],
})
export class AppModule { }