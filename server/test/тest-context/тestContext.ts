import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as uuid from 'uuid';
import { SETTINGS } from 'src/core/settings';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { AuthTestManager } from '../helpers/auth-test-manager';
import mongoose, { Connection, Types } from 'mongoose';
import { BlogsTestManager } from '../helpers/blogs-test-manager';
import { CommentsTestManager } from '../helpers/comments-test-manager';
import { LikesTestManager } from '../helpers/likes-test-manager';
import { PostsTestManager } from '../helpers/posts-test-manager';
import { UserSessionTestManager } from '../helpers/user-session-test-manager';
import { UsersTestManager } from '../helpers/users-test-manager';
import { MeViewDto, UserViewDto } from 'src/modules/user.accounts/users-dto/users.view-dto';
import { BlogViewDto } from 'src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto';
import { PostViewDto } from 'src/modules/bloggers-platform/posts/posts-api/posts-view-dto/posts.view-dto';
import { CommentViewDto } from 'src/modules/bloggers-platform/comments/comments-api/comments-view-dto/comments.view-dto';
import { UsersRepository } from 'src/modules/user.accounts/users-infrastructure/users.repository';
import { AuthService } from 'src/modules/auth/auth-application/auth.service';
import { UsersService } from 'src/modules/user.accounts/users-application/users.service';
import { EmailService } from 'src/modules/notifications/email.service';
import { TokenService } from 'src/modules/tokens/tokens-application/token-service';
import { Session } from 'src/modules/usersSessions/sessions-domain/sessions.entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { SessionContextClass } from './context-module/sessions-context';
import { ConstantsContextClass } from './context-module/constants-context';
import { UserContextClass } from './context-module/user-context';
import { BlogsContextClass } from './context-module/blogs-context';
import { PostsContextClass } from './context-module/posts-context';
import { CommentsContextClass } from './context-module/comments-context';
import { GetUsersQueryParams } from 'src/modules/user.accounts/users-dto/get-users-query-params.input-dto';
import { SessionsRepository } from 'src/modules/usersSessions/sessions-infrastructure/session.repository';
import { ConfirmationRepository } from 'src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository';
import { ConfirmationsCodesService } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { IsBlockedEmailResendingService } from 'src/core/utils/blocked-utilite';
import { CodeConfirmationContextClass } from './context-module/code-confirmation-context';

export class TestContext {
    public app: INestApplication;
    public databaseConnection: Connection;
    public httpServer: INestApplication;

    public authServices: AuthService;
    public userService: UsersService | any;
    public usersRepository: UsersRepository;
    public sessiosRepository: SessionsRepository;
    public mailService: EmailService | any;
    public tokenService: TokenService | any;
    public mongoDBCollection: any;
    public confirmationService: ConfirmationsCodesService;
    public isBlockedEmailResendingService: IsBlockedEmailResendingService;
    public confirmationRepository: ConfirmationRepository;

    public userParams: GetUsersQueryParams

    public authTestManager: AuthTestManager;
    public blogsTestManager: BlogsTestManager;
    public commentsTestManager: CommentsTestManager;
    public likesTestManager: LikesTestManager;
    public postsTestManager: PostsTestManager;
    public userSessionTestManager: UserSessionTestManager;
    public usersTestManager: UsersTestManager;

    // TODO - Добавить
    public createdDialog1: any
    public createdMessage1: any
    public createdMessage2: any
    public createdMessage3: any

    public constants: ConstantsContextClass;
    public sessions: SessionContextClass;
    public users: UserContextClass;
    public blogs: BlogsContextClass;
    public posts: PostsContextClass;
    public comments: CommentsContextClass;
    public codeConfirmation: CodeConfirmationContextClass;

    constructor() {
        this.constants = new ConstantsContextClass();
        this.sessions = new SessionContextClass();
        this.users = new UserContextClass();
        this.blogs = new BlogsContextClass();
        this.posts = new PostsContextClass();
        this.comments = new CommentsContextClass();
        this.codeConfirmation = new CodeConfirmationContextClass();
    }
}