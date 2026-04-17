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
import { CommandBus } from '@nestjs/cqrs';
import { MeViewDto, UserViewDto } from 'src/modules/user-accounts/users-dto/users.view-dto';
import { BlogViewDto } from 'src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto';
import { PostViewDto } from 'src/modules/bloggers-platform/posts/posts-api/posts-view-dto/posts.view-dto';
import { CommentViewDto } from 'src/modules/comments/comments-api/comments-view-dto/comments.view-dto';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';
import { AuthService } from 'src/modules/auth/auth-application/auth.service';
import { EmailService } from 'src/modules/notifications/email.service';
import { TokenService } from 'src/modules/tokens/tokens-application/token-service';
import { Session } from 'src/modules/user-sessions/sessions-domain/sessions.entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { SessionContextClass } from './context-module/sessions-context';
import { ConstantsContextClass } from './context-module/constants-context';
import { UserContextClass } from './context-module/user-context';
import { BlogsContextClass } from './context-module/blogs-context';
import { CommentsContextClass } from './context-module/comments-context';
import { GetUsersQueryParams } from 'src/modules/user-accounts/users-dto/get-users-query-params.input-dto';
import { SessionsRepository } from 'src/modules/user-sessions/sessions-infrastructure/session.repository';
import { ConfirmationRepository } from 'src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository';
import { ConfirmationsCodesService } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { IsBlockedEmailResendingService } from 'src/core/utils/blocked-utilite';
import { CodeConfirmationContextClass } from './context-module/code-confirmation-context';
import { UserPhotosTestManager } from 'test/helpers/user-photos-test-manager';
import { UserPhotoAlbumsTestManager } from 'test/helpers/user-photo-albums-test-manager';
import { UserMessagesTestManager } from 'test/helpers/messages-test-manager';
import { PostsForProfileTestManager } from 'test/helpers/posts-for-profile-test-manager';
import { PostsForProfileContextClass } from './context-module/posts-for-profile-context';
import { PostsForBlogContextClass } from './context-module/posts-for-blogs-context';
import { ShopBasketTestManager } from 'test/helpers/shopHelpers/baske-test-manager';
import { ShopBasketMerchandiseTestManager } from 'test/helpers/shopHelpers/basket-merchandise-test-manager';
import { MerchandiseBrandTestManager } from 'test/helpers/shopHelpers/merchandise-brand-test-manager';
import { MerchandiseTestManager } from 'test/helpers/shopHelpers/merchandise-test-manager';
import { MerchandiseTypesTestManager } from 'test/helpers/shopHelpers/merchandise-types-test-manager';
import { ShopTypesTestManager } from 'test/helpers/shopHelpers/shop-types-test-manager';
import { ShopTestManager } from 'test/helpers/shopHelpers/shops-test-manager';
import { ShopsContextClass } from './context-module/shopsContext/shops-context';
import { ShopTypesContextClass } from './context-module/shopsContext/shop-types-context';
import { BasketContextClass } from './context-module/shopsContext/basket-context';
import { BasketMerchandiseContextClass } from './context-module/shopsContext/basket-merchandise-context';
import { MerchandiseBrandContextClass } from './context-module/shopsContext/merchandise-brand-context';
import { MerchandiseContextClass } from './context-module/shopsContext/merchandise-context';
import { MerchandiseTypesContextClass } from './context-module/shopsContext/merchandise-types-context';
import { ShopBrandsTestManager } from 'test/helpers/shopHelpers/shop-brands-test-manager copy';
import { ShopBrandsContextClass } from './context-module/shopsContext/shop-brands-context';

export class TestContext {
    public app: INestApplication;
    public databaseConnection: Connection;
    public httpServer: INestApplication;

    public сommandBus: CommandBus;

    public authServices: AuthService;
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
    public postsForProfileTestManager: PostsForProfileTestManager;
    
    public userSessionTestManager: UserSessionTestManager;
    public userMessagesTestManager: UserMessagesTestManager;
    public usersTestManager: UsersTestManager;
    public userPhotosTestManager: UserPhotosTestManager;
    public userPhotoAlbumsTestManager: UserPhotoAlbumsTestManager;

    public shopBasketTestManager: ShopBasketTestManager;
    public shopBasketMerchandiseTestManager: ShopBasketMerchandiseTestManager;
    public merchandiseBrandTestManager: MerchandiseBrandTestManager;
    public merchandiseTestManager: MerchandiseTestManager;
    public merchandiseTypesTestManager: MerchandiseTypesTestManager;
    public shopTypesTestManager: ShopTypesTestManager;
    public shopBrandsTestManager: ShopBrandsTestManager;
    public shopTestManager: ShopTestManager;


    // TODO - Добавить
    public createdDialog1: any
    public createdMessage1: any
    public createdMessage2: any
    public createdMessage3: any

    public constants: ConstantsContextClass;
    public sessions: SessionContextClass;
    public users: UserContextClass;
    public blogs: BlogsContextClass;
    public posts_for_blog: PostsForBlogContextClass;
    public posts_for_profile: PostsForProfileContextClass;
    public comments: CommentsContextClass;
    public codeConfirmation: CodeConfirmationContextClass;

    public shops: ShopsContextClass;
    public shopType: ShopTypesContextClass;
    public shopBrand: ShopBrandsContextClass;
    public basket: BasketContextClass;
    public basketMerchandise: BasketMerchandiseContextClass;
    public merchandiseBrand: MerchandiseBrandContextClass;
    public merchandiseType: MerchandiseTypesContextClass;
    public merchandise: MerchandiseContextClass;


    constructor() {
        this.constants = new ConstantsContextClass();
        this.sessions = new SessionContextClass();
        this.users = new UserContextClass();
        this.blogs = new BlogsContextClass();
        this.posts_for_blog = new PostsForBlogContextClass();
        this.posts_for_profile = new PostsForProfileContextClass();
        this.comments = new CommentsContextClass();
        this.codeConfirmation = new CodeConfirmationContextClass();

        this.shops = new ShopsContextClass();
        this.shopType = new ShopTypesContextClass();
        this.shopBrand = new ShopBrandsContextClass();
        this.basket = new BasketContextClass();
        this.basketMerchandise = new BasketMerchandiseContextClass();
        this.merchandiseBrand = new MerchandiseBrandContextClass();
        this.merchandiseType = new MerchandiseTypesContextClass();
        this.merchandise = new MerchandiseContextClass();

    }
}