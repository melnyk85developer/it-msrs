import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../../src/app.module';
import { appSetup } from '../../src/setup/app.setup';
import { deleteAllData } from './delete-all-data';
import { EmailService } from '../../src/modules/notifications/email.service';
import { UsersTestManager } from './users-test-manager';
import { EmailServiceMock } from 'test/mock/email-service.mock';
import { AuthTestManager } from './auth-test-manager';
import { TestContext } from 'test/тest-context/тestContext';
import { BlogsTestManager } from './blogs-test-manager';
import { CommentsTestManager } from './comments-test-manager';
import { LikesTestManager } from './likes-test-manager';
import { PostsTestManager } from './posts-test-manager';
import { UserSessionTestManager } from './user-session-test-manager';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';
import { AuthService } from 'src/modules/auth/auth-application/auth.service';
import { TokenService } from 'src/modules/tokens/tokens-application/token-service';
import { SessionsRepository } from 'src/modules/user-sessions/sessions-infrastructure/session.repository';
import { ConfirmationRepository } from 'src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository';
import { ConfirmationsCodesService } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { IsBlockedEmailResendingService } from 'src/core/utils/blocked-utilite';
import { UserPhotosTestManager } from './user-photos-test-manager';
import { UserPhotoAlbumsTestManager } from './user-photo-albums-test-manager';
import { UserMessagesTestManager } from './messages-test-manager';
import { UserRegistrationCommand } from 'src/modules/auth/auth-application/auth-use-cases/registration-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { PostsForProfileTestManager } from './posts-for-profile-test-manager';
import { CoreConfig } from 'src/core/core.config';
import { ShopBasketTestManager } from './shopHelpers/baske-test-manager';
import { ShopBasketMerchandiseTestManager } from './shopHelpers/basket-merchandise-test-manager';
import { MerchandiseBrandTestManager } from './shopHelpers/merchandise-brand-test-manager';
import { MerchandiseTestManager } from './shopHelpers/merchandise-test-manager';
import { MerchandiseTypesTestManager } from './shopHelpers/merchandise-types-test-manager';
import { ShopTypesTestManager } from './shopHelpers/shop-types-test-manager';
import { ShopTestManager } from './shopHelpers/shops-test-manager';
import { ShopBrandsTestManager } from './shopHelpers/shop-brands-test-manager copy';

// 1. Создаем ЕДИНЫЙ ЭКЗЕМПЛЯР
export const contextTests = new TestContext()

export const initSettings = async (
    //передаем callback, который получает ModuleBuilder, если хотим изменить настройку тестового модуля
    addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(EmailService)
        .useClass(EmailServiceMock);

    if (addSettingsToModuleBuilder) {
        addSettingsToModuleBuilder(testingModuleBuilder);
    }

    const testingAppModule = await testingModuleBuilder.compile();

    contextTests.app = testingAppModule.createNestApplication();
    const coreConfig = contextTests.app.get<CoreConfig>(CoreConfig);
    appSetup(contextTests.app, coreConfig.isSwaggerEnabled);
    await contextTests.app.init();

    contextTests.databaseConnection = contextTests.app.get<Connection>(getConnectionToken());
    contextTests.httpServer = contextTests.app.getHttpServer();

    contextTests.сommandBus = testingAppModule.get<CommandBus>(CommandBus);

    contextTests.mailService = contextTests.app.get<EmailService>(EmailService);
    contextTests.tokenService = contextTests.app.get<TokenService>(TokenService);

    contextTests.authServices = contextTests.app.get<AuthService>(AuthService);
    contextTests.usersRepository = contextTests.app.get<UsersRepository>(UsersRepository);
    contextTests.sessiosRepository = contextTests.app.get<SessionsRepository>(SessionsRepository);
    contextTests.confirmationService = contextTests.app.get<ConfirmationsCodesService>(ConfirmationsCodesService);
    contextTests.isBlockedEmailResendingService = contextTests.app.get<IsBlockedEmailResendingService>(IsBlockedEmailResendingService);
    contextTests.confirmationRepository = contextTests.app.get<ConfirmationRepository>(ConfirmationRepository);

    contextTests.authTestManager = new AuthTestManager(contextTests.app);
    contextTests.blogsTestManager = new BlogsTestManager(contextTests.app);
    contextTests.commentsTestManager = new CommentsTestManager(contextTests.app);
    contextTests.likesTestManager = new LikesTestManager(contextTests.app);
    contextTests.postsTestManager = new PostsTestManager(contextTests.app);
    contextTests.postsForProfileTestManager = new PostsForProfileTestManager(contextTests.app);

    contextTests.userSessionTestManager = new UserSessionTestManager(contextTests.app);
    contextTests.userMessagesTestManager = new UserMessagesTestManager(contextTests.app);
    contextTests.usersTestManager = new UsersTestManager(contextTests.app);
    contextTests.userPhotosTestManager = new UserPhotosTestManager(contextTests.app);
    contextTests.userPhotoAlbumsTestManager = new UserPhotoAlbumsTestManager(contextTests.app);

    contextTests.shopBasketTestManager = new ShopBasketTestManager(contextTests.app);
    contextTests.shopBasketMerchandiseTestManager = new ShopBasketMerchandiseTestManager(contextTests.app);
    contextTests.merchandiseBrandTestManager = new MerchandiseBrandTestManager(contextTests.app);
    contextTests.merchandiseTestManager = new MerchandiseTestManager(contextTests.app);
    contextTests.merchandiseTypesTestManager = new MerchandiseTypesTestManager(contextTests.app);
    contextTests.shopTypesTestManager = new ShopTypesTestManager(contextTests.app);
    contextTests.shopBrandsTestManager = new ShopBrandsTestManager(contextTests.app);
    contextTests.shopTestManager = new ShopTestManager(contextTests.app);


    await deleteAllData(contextTests.app);

    return {
        app: contextTests.app,
        databaseConnection: contextTests.databaseConnection,
        httpServer: contextTests.httpServer,
        authTestManger: contextTests.authTestManager,
        blogsTestManager: contextTests.blogsTestManager,
        commentsTestManager: contextTests.commentsTestManager,
        likesTestManager: contextTests.likesTestManager,
        postsTestManager: contextTests.postsTestManager,
        userSessionTestManager: contextTests.userSessionTestManager,
        userMessagesTestManager: contextTests.userMessagesTestManager,
        usersTestManager: contextTests.usersTestManager,
        userPhotosTestManager: contextTests.userPhotosTestManager,
        userPhotoAlbumsTestManager: contextTests.userPhotoAlbumsTestManager,

        shopBasketTestManager: contextTests.shopBasketTestManager,
        shopBasketMerchandiseTestManager: contextTests.shopBasketMerchandiseTestManager,
        merchandiseBrandTestManager: contextTests.merchandiseBrandTestManager,
        merchandiseTestManager: contextTests.merchandiseTestManager,
        merchandiseTypesTestManager: contextTests.merchandiseTypesTestManager,
        shopTypesTestManager: contextTests.shopTypesTestManager,
        shopTypesBrandManager: contextTests.shopBrandsTestManager,
        shopTestManager: contextTests.shopTestManager,

    };
};