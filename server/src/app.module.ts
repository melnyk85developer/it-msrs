import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { CoreModule } from './core/core.module';
import { UserAccountsModule } from './modules/user.accounts/user-accounts.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TokenModule } from './modules/tokens/token.module';
import { SessionModule } from './modules/usersSessions/sessions.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/it-mars'),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.development.env',
        }),
        NotificationsModule,
        UserAccountsModule,
        BloggersPlatformModule,
        TestingModule,
        CoreModule,
        TokenModule,
        SessionModule
    ]
})
export class AppModule { }