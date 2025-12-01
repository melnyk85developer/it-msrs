import mongoose from "mongoose";
import { blogsE2eTest } from "src/modules/bloggers-platform/blogs/blogs-testing/testing-E2E-Blogs.api";
import { postsE2eTest } from "src/modules/bloggers-platform/posts/testing-posts/testing-E2E-Posts.api";
import { commentsE2eTest } from "src/modules/bloggers-platform/comments/testing-comments/testing-E2E-Comments.api";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { authE2eTest } from 'src/modules/auth/auth-testing/testing-E2E-Auth.api';
import { contextTests, initSettings } from './helpers/init-settings';
import { JwtService } from '@nestjs/jwt';
import { authIntegrationTest } from "src/modules/auth/auth-testing/testing-INTEGRATION-Auth.api";
import { authUnitTest } from "src/modules/auth/auth-testing/testing-Unit-Auth.api";
import { userSessionE2eTest } from "src/modules/usersSessions/sessions-testing/testing-E2E-Sessions.api";
import { usersE2eTest } from "src/modules/user.accounts/testing-users/testing-E2E-Users.api";

describe('ALL TESTS IT-INCUBATOR PROJEKT', () => {
    beforeAll(async () => {
        const result = await initSettings((moduleBuilder) =>
            moduleBuilder
                .overrideModule(ConfigModule) // 1. Переопределяем ConfigModule
                .useModule(
                    ConfigModule.forRoot({
                        isGlobal: true,
                        envFilePath: '.test.env', // Используем файл для тестов
                    }),
                )
                // 2. Переопределяем JwtService, используя useFactory для получения ConfigService
                .overrideProvider(JwtService)
                .useFactory({
                    inject: [ConfigService], // Инжектируем ConfigService
                    factory: (configService: ConfigService) => { // Получаем его
                        return new JwtService({
                            // 3. Используем реальный секрет из .test.env
                            secret: configService.get('JWT_ACCESS_SECRET'),
                            // 4. Оставляем специфичное для тестов время жизни
                            signOptions: { expiresIn: '2s' },
                        });
                    },
                }),
        );
        contextTests.app = result.app;
    });
    describe('AUTH-BLOCK-TESTS', () => {
        authE2eTest()
        // authIntegrationTest()
        // authUnitTest()
    })
    describe('USER-SESSIONS-BLOCK-TESTS', () => {
        userSessionE2eTest()
        // usersSessionsInegrationTest()
    })
    // describe('CONFIRMATION-BLOCK-TESTS', () => {
    //     resetPasswordInegrationTest()
    // })
    describe('BLOGS-BLOCK-TESTS', () => {
        blogsE2eTest()
    })
    describe('POSTS-BLOCK-TESTS', () => {
        postsE2eTest()
    })
    describe('COMMENTS-BLOCK-TESTS', () => {
        commentsE2eTest()
    })
    // describe('LIKES-BLOCK-TESTS', () => {
    //     likesE2eTest()
    // })
    describe('USERS-BLOCK-TESTS', () => {
        usersE2eTest()
    })
    afterAll(async () => {
        await mongoose.disconnect();
        await contextTests.app.close();
    });
})

