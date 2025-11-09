import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { CoreModule } from './core/core.module';
import { UserAccountsModule } from './modules/user.accounts/user-accounts.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/it-mars'),
        UserAccountsModule,
        BloggersPlatformModule,
        TestingModule,
        CoreModule,
        // NotificationsModule,
    ]
})
export class AppModule { }