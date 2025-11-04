import request from 'supertest';
import mongoose from "mongoose";
import * as dotenv from 'dotenv'
import * as uuid from 'uuid';
import { contextTests } from "./contextTests";
import { SETTINGS } from "src/shared/settings";
import { getRequest } from "./managersTests/authTestManager";
import { blogsE2eTest } from "src/modules/bloggers-platform/blogs/blogs-testing/testing-E2E-Blogs.api";
import { postsE2eTest } from "src/modules/bloggers-platform/posts/testing-posts/testing-E2E-Posts.api";
import { commentsE2eTest } from "src/modules/bloggers-platform/comments/testing-comments/testing-E2E-Comments.api";
import { usersE2eTest } from "src/modules/user.accounts/testing-users/testing-E2E-Users.api";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from '@nestjs/config';
import { AppModule } from "src/app.module";
import cookieParser from "cookie-parser";
import { HTTP_STATUSES } from 'src/shared/utils/utils';
import { GetUsersQueryParams } from 'src/modules/user.accounts/users-api/input-dto-users/get-users-query-params.input-dto';

dotenv.config({ quiet: true });

const initilizationContext = () => {
    contextTests.buff2 = Buffer.from(SETTINGS.ADMIN, 'utf8')
    contextTests.codedAuth = contextTests.buff2.toString('base64')

    contextTests.invalidToken = '245678901245678901123456';
    contextTests.expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoicGFzc3dvcmQiLCJ1c2VySWQiOiI2NzJhMzdmMDkzZDUzMjFmNGZjNjE5M2UiLCJpYXQiOjE3MzA4MjAwODUsImV4cCI6MTczMDgyMDk4NX0.lpZlmruicYbzJ_y3k8rkyAYWnFlpwEhjG2e1K6jFGSk';
    contextTests.incorectData = [undefined, null, NaN, {}, '@', '"', '&', '*', '(', ')', '=', '+', ';', ':', '<', '>', ',', '.', '`', '~', '!', '^', '$', '-', 'a', 'A'];
    // '?', [], '%', '#', '/', 

    contextTests.payload = '245678901245678901123456';
    contextTests.invalidId = '66b9413d36f75d0b44ad1c5a';
    contextTests.randomId = uuid.v4();


    contextTests.userParams = null
    // contextTests.mongoDBCollection = container.get(MongoDBCollection);
    // contextTests.authServices = container.get(AuthServices);
    // contextTests.userService = container.get(UserService);
    // contextTests.mailService = container.get(MailService);
    // contextTests.usersSessionService = container.get(SecurityDeviceServices);
    // contextTests.tokenService = container.get(TokenService);

    // contextTests.confirmationRepository = container.get(ConfirmationRepository);

    contextTests.total_number_of_active_sessions_in_tests = 0;
    contextTests.total_number_of_comments_in_tests = 0;

    contextTests.userAgent = [
        // 📱 iPhone 15 Pro (iOS 17, Safari)
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        // 📱 Samsung Galaxy S24 (Android 14, Chrome)
        'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.0 Mobile Safari/537.36',
        // 📱 Google Pixel 8 Pro (Android 14, Chrome)
        'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.0 Mobile Safari/537.36',
        // 💻 Windows 11 (Chrome)
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
        // 💻 macOS Sonoma (Safari)
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        // 💻 Ubuntu 24.04 LTS (Firefox)
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
        // 💻 Macbook M3 Pro (Edge)
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36 Edg/125.0.2535.67',
        // 📱 iPad Pro M2 (iPadOS 17, Safari)
        'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        // 📺 Smart TV Samsung Tizen OS
        'Mozilla/5.0 (SMART-TV; Linux; Tizen 7.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/5.1 TV Safari/537.36',
        // 📺 Android TV (Sony Bravia, Android 12)
        'Mozilla/5.0 (Linux; Android 12; BRAVIA 4K UR3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.0 Safari/537.36',
        // 🕹️ Steam Deck (SteamOS 3, Chrome)
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36 SteamOS/3.0 SteamDeck/1.0',
        // 📱 Xiaomi 14 Ultra (HyperOS, Android 14)
        'Mozilla/5.0 (Linux; Android 14; Xiaomi 23127PN0CC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Mobile Safari/537.36'
    ];

    contextTests.correctUserName1 = 'Maksym'
    contextTests.correctUserSurName1 = 'Melnyk'
    contextTests.correctUserEmail1 = 'webmars@example.com'
    contextTests.correctUserPassword1 = 'password'

    contextTests.correctBlogNsme1 = 'MyBlog'
    contextTests.correctBlogDescription1 = 'Description blog'
    contextTests.correctWebsiteUrl1 = 'https://webmars.com'

    contextTests.correctTitleBlog1Post1 = 'My Post1 Title'
    contextTests.shortDescriptionBlog1Post1 = 'MyPost 1 - shortDescription'
    contextTests.contentBlog1Post1 = "content 1 content 1 content 1 content 1 content"

    contextTests.correctTitleBlog1Post2 = 'My Post Title2'
    contextTests.shortDescriptionBlog1Post2 = 'MyPost - 2 shortDescription'
    contextTests.contentBlog1Post2 = "content 2 content 2 content 2 content 2 content"

    contextTests.contentBlog1Post1Comment1 = 'Комментарий test1 content1'

    contextTests.contentBlog1Post1Comment2 = 'Комментарий test2 content2'
    contextTests.contentBlog1Post1Comment3 = 'Комментарий test3 content3'

    contextTests.correctUserName2 = 'Viktor'
    contextTests.correctUserSurName2 = 'Melnyk'
    contextTests.correctUserEmail2 = 'webmars2@example.com'
    contextTests.correctUserPassword2 = 'password2'

    contextTests.correctBlogNsme2 = 'ViktorBlog'
    contextTests.correctBlogDescription2 = 'Description ViktorBlog'
    contextTests.correctWebsiteUrl2 = 'https://example.com'

    contextTests.correctTitleBlog1Post3 = 'Viktor post Title update post'
    contextTests.shortDescriptionBlog1Post3 = 'Viktor post shortDescription update post'
    contextTests.contentBlog1Post3 = "content 3 content 3 content 3 content 3 content update post"

    contextTests.correctUserName3 = 'Nataly'
    contextTests.correctUserSurName3 = 'Melnyk'
    contextTests.correctUserEmail3 = 'webmars3@example.com'
    contextTests.correctUserPassword3 = 'password3'

    contextTests.correctBlogNsme3 = 'NataliBlog'
    contextTests.correctBlogDescription3 = 'description'
    contextTests.correctWebsiteUrl3 = 'https://example.com'

    contextTests.correctUserName4 = 'Aleksandra'
    contextTests.correctUserSurName4 = 'Melnyk'
    contextTests.correctUserEmail4 = 'webmars4@example.com'
    contextTests.correctUserPassword4 = 'password4'

    contextTests.correctBlogNsme4 = 'AleksandraBlog'
    contextTests.correctBlogDescription4 = 'Description AleksandraBlog'
    contextTests.correctWebsiteUrl4 = 'https://example.com'
}
export const delay = (milliseconds: number) => new Promise((resolve) => {
    return setTimeout(() => resolve(true), milliseconds);
});
describe('ALL TESTS IT-INCUBATOR PROJEKT', () => {
    // const mongoUrl = process.env.MONGO_LOCAL_URL;
    // const dbName = process.env.PROJEKT_NAME_TEST || "socialnetwork_test";

    initilizationContext()

    beforeAll(async () => {
        console.log('⏳ Подготовка к запуску тестов...');
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.test.env',
                    isGlobal: true,
                }),
                AppModule,
            ],
        }).compile()
        contextTests.app = testingModule.createNestApplication();
        contextTests.app.use(cookieParser());
        await contextTests.app.init()
        // создаём "тестовый клиент" к приложению
        contextTests.httpServer = contextTests.app.getHttpServer();
        await request(contextTests.httpServer).delete('/testing/all-data').expect(HTTP_STATUSES.NO_CONTENT_204)

        // const sequelize = testingModule.get<Sequelize>(getConnectionToken());
        // await sequelize.sync({ force: true });
        // contextTests.authService = testingModule.get<AuthService>(AuthService);
        // contextTests.usersSessionService = testingModule.get<UsersSessionService>(UsersSessionService);
        // contextTests.tokenService = testingModule.get<TokenService>(TokenService);
        // contextTests.mailService = testingModule.get<MailService>(MailService);
        // jest.spyOn(contextTests.mailService, 'sendMail').mockResolvedValue(true);
    })

    // // describe('AUTH-BLOCK-TESTS', () => {
    // //     authE2eTest()
    // //     authIntegrationTest()
    // //     // authUnitTest()
    // // })
    // // describe('USER-SESSIONS-BLOCK-TESTS', () => {
    // //     usersSessionsE2eTest()
    // //     usersSessionsInegrationTest()
    // // })
    // // describe('CONFIRMATION-BLOCK-TESTS', () => {
    // //     resetPasswordInegrationTest()
    // // })
    describe('BLOGS-BLOCK-TESTS', () => {
        blogsE2eTest()
    })
    describe('POSTS-BLOCK-TESTS', () => {
        postsE2eTest()
    })
    describe('COMMENTS-BLOCK-TESTS', () => {
        commentsE2eTest()
    })
    // // describe('LIKES-BLOCK-TESTS', () => {
    // //     likesE2eTest()
    // // })
    describe('USERS-BLOCK-TESTS', () => {
        usersE2eTest()
    })
    afterAll(async () => {
        // const mailService = container.get(MailService)
        // mailService.closeTransporter()
        // await contextTests.mongoDBCollection.close()
        await mongoose.disconnect();
    });
})

