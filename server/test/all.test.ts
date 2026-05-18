import mongoose from "mongoose";
import { blogsE2eTest } from "src/modules/bloggers-platform/blogs/blogs-testing/testing-E2E-Blogs.api";
import { postsE2eTest } from "src/modules/bloggers-platform/posts/testing-posts/testing-E2E-Posts.api";
import { commentsE2eTest } from "src/modules/comments/testing-comments/testing-E2E-Comments.api";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { authE2eTest } from 'src/modules/auth/auth-testing/testing-E2E-Auth.api';
import { contextTests, initSettings } from './helpers/init-settings';
import { JwtService } from '@nestjs/jwt';
import { authIntegrationTest } from "src/modules/auth/auth-testing/testing-INTEGRATION-Auth.api";
import { authUnitTest } from "src/modules/auth/auth-testing/testing-Unit-Auth.api";
import { userSessionE2eTest } from "src/modules/user-sessions/sessions-testing/testing-E2E-Sessions.api";
import { usersE2eTest } from "src/modules/user-accounts/testing-users/testing-E2E-Users.api";
import { resetPasswordInegrationTest } from "src/modules/user-accounts/testing-users/testing-RESET-PASSWORD-INTEGRATION";
import { registrEmailResendingAndConfirmIntegrationTest } from "src/modules/user-accounts/testing-users/testing-REGISTRATION-EMAIL-RESSENDING-INTEGRATION";
import { photoProfileE2ETest } from "src/modules/gallery/photos/testing-photos/testing-E2E-photoProfile";
import { photoAlbumsE2ETest } from "src/modules/gallery/photoAlbums/testing-photo-albums/testing-E2E-photo-albums";
import { userMessagesE2eTest } from "src/modules/user-messages/msg/testing-messages/testing-E2E-Messages";
import { postForProfileE2ETest } from "src/modules/posts-for-profile/testing-posts-for-profile/testing-E2E-Posts-for-profile";
import { likesE2eTest } from "src/modules/likes/testing-likes/testing-E2E-Likes.api";
import { UserAccountsConfig } from "src/modules/user-accounts/users-config/users.config";
import { join } from "path";
import { CoreConfig } from "src/core/core.config";
import { shopTypeE2ETest } from "src/modules/shops-platform/shop-type/testing-shop-type/shopsTypes-E2E-testing";
import { shopsE2ETest } from "src/modules/shops-platform/shops/testing-shops/shops-E2E-testing";
import { merchandiseTypeE2ETest } from "src/modules/shops-platform/merchandise-type/testing-merchandise-type/merchandiseType-E2E-Testing";
import { merchandiseBrandsE2ETest } from "src/modules/shops-platform/merchandise-brand/testing-merchandise-brand/merchandiseBrands-E2E-testing";
import { merchandiseE2ETest } from "src/modules/shops-platform/merchandise/testing-merchandise/merchandise-E2E-testing";
import { basketE2ETest } from "src/modules/shops-platform/basket/testing-basket/basket-E2E-testing";
import { basketMerchandiseE2ETest } from "src/modules/shops-platform/basket-merchandise/testing-basketMerchandise/basketMerchandise-E2E-testing";
import { shopBrandE2ETest } from "src/modules/shops-platform/shop-brand/testing-shop-brand/shopsBrands-E2E-testing";
import { aiAssistantsMegsE2eTest } from "src/modules/admin/ai-assistant/ai-assistant-chats/testing-messages/testing-e2e-ai-assistant-messages";
import { aiAssistantMessagesIntegrationTest } from "src/modules/admin/ai-assistant/ai-assistant-chats/testing-messages/testing-integration-ai-assistent-msg";

describe('ALL TESTS IT-INCUBATOR PROJEKT', () => {

    beforeAll(async () => {
        const result = await initSettings((moduleBuilder) =>
            moduleBuilder
                .overrideModule(ConfigModule) // 1. Переопределяем ConfigModule
                .useModule(
                    ConfigModule.forRoot({
                        isGlobal: true,
                        envFilePath: '.env.testing', // Используем файл для тестов
                    }),
                )
                // 2. Переопределяем JwtService, используя useFactory для получения ConfigService
                .overrideProvider(JwtService)
                .useFactory({
                    inject: [ConfigService], // Инжектируем ConfigService
                    // factory: (configService: ConfigService) => { // Получаем его
                    factory: (userAccountsConfig: UserAccountsConfig) => {
                        return new JwtService({
                            // 3. Используем реальный секрет из .test.env
                            secret: userAccountsConfig.accessTokenSecret,
                            // 4. Оставляем специфичное для тестов время жизни
                            signOptions: { expiresIn: '15m' },
                        });
                    },
                }),
        );
        // contextTests.app = result.app;
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
    // describe('ADMIN-BLOCK-TESTS', () => { 
    //     // aiAssistantsMegsE2eTest()
    //     aiAssistantMessagesIntegrationTest()
    // })
    describe('MESSAGES-BLOCK-TESTS', () => {
        userMessagesE2eTest()
    })
    // describe('BLOGS-BLOCK-TESTS', () => {
    //     blogsE2eTest()
    // })
    // describe('POSTS-BLOCK-TESTS', () => {
    //     postsE2eTest()
    // })
    // describe('COMMENTS-BLOCK-TESTS', () => {
    //     commentsE2eTest()
    // })
    // describe('LIKES-BLOCK-TESTS', () => {
    //     likesE2eTest()
    // })
    // describe('SHOPS-BLOCK-TESTS', () => {
    //     shopTypeE2ETest()
    //     shopBrandE2ETest()
    //     shopsE2ETest()
    //     merchandiseTypeE2ETest()
    //     merchandiseBrandsE2ETest()
    //     merchandiseE2ETest()
    //     basketE2ETest()
    //     basketMerchandiseE2ETest()
    // })
    // describe('PHOTOS-BLOCK-TESTS', () => {
    //     photoProfileE2ETest()
    //     photoAlbumsE2ETest()
    // })
    // describe('USERS-BLOCK-TESTS', () => {
    //     postForProfileE2ETest()
    //     usersE2eTest()
    // })
    // describe('CONFIRMATION-BLOCK-TESTS', () => {
    //     registrEmailResendingAndConfirmIntegrationTest()
    //     resetPasswordInegrationTest()
    // })
    afterAll(async () => {
        await mongoose.disconnect();
        await contextTests.app.close();
    });
})

