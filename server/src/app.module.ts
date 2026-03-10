import { DynamicModule, Module } from '@nestjs/common';
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
import { configModule } from './config-dynamic-module';
import { CoreConfig } from './core/core.config';

@Module({
    imports: [
        // 1. Настраиваем ConfigModule ПЕРВЫМ
        // 2. Mongoose подключаем АСИНХРОННО. 
        // Он будет ждать, пока ConfigModule прочитает нужный файл.
        MongooseModule.forRootAsync({
            useFactory: (coreConfig: CoreConfig) => {
                const uri = coreConfig.mongoURI;
                console.log('DB_URI: AppModule', uri);

                return {
                    uri: uri,
                };
            },
            inject: [CoreConfig],
        }),
        // MongooseModule.forRootAsync({
        //     imports: [ConfigModule],
        //     useFactory: async (configService: ConfigService) => ({
        //         // Читаем URL базы из переменных, а не хардкодим здесь
        //         uri: configService.get<string>('DB_URL'),
        //     }),
        //     inject: [ConfigService],
        // }),

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
        LikeModule,

        configModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: SuccessMessageInterceptor,
        },
    ],
})
export class AppModule {
    static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {
        // такой мудрёный способ мы используем, чтобы добавить к основным модулям необязательный модуль.
        // чтобы не обращаться в декораторе к переменной окружения через process.env в декораторе, потому что
        // запуск декораторов происходит на этапе склейки всех модулей до старта жизненного цикла самого NestJS

        return {
            module: AppModule,
            imports: [...(coreConfig.includeTestingModule ? [TestingModule] : [])], // Add dynamic modules here
        };
    }
}