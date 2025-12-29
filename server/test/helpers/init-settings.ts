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
import { UsersRepository } from 'src/modules/user.accounts/users-infrastructure/users.repository';
import { AuthService } from 'src/modules/auth/auth-application/auth.service';
import { UsersService } from 'src/modules/user.accounts/users-application/users.service';
import { TokenService } from 'src/modules/tokens/tokens-application/token-service';
import { SessionsRepository } from 'src/modules/usersSessions/sessions-infrastructure/session.repository';
import { ConfirmationRepository } from 'src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository';
import { ConfirmationsCodesService } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { IsBlockedEmailResendingService } from 'src/core/utils/blocked-utilite';

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
    appSetup(contextTests.app);
    await contextTests.app.init();

    contextTests.databaseConnection = contextTests.app.get<Connection>(getConnectionToken());
    contextTests.httpServer = contextTests.app.getHttpServer();
    contextTests.mailService = contextTests.app.get<EmailService>(EmailService);
    contextTests.tokenService = contextTests.app.get<TokenService>(TokenService);
    contextTests.authServices = contextTests.app.get<AuthService>(AuthService);
    contextTests.userService = contextTests.app.get<UsersService>(UsersService);
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
    contextTests.userSessionTestManager = new UserSessionTestManager(contextTests.app);
    contextTests.usersTestManager = new UsersTestManager(contextTests.app);

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
        usersTestManager: contextTests.usersTestManager,
    };
};