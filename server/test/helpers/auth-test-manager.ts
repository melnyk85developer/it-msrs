import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { delay } from './delay';
import { MeViewDto, UserViewDto } from 'src/modules/user.accounts/users-dto/users.view-dto';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { contextTests } from './init-settings';
import { CreateUserInputDto } from 'src/modules/user.accounts/users-dto/users.input-dto';

export class AuthTestManager {
    constructor(private app: INestApplication) { }

    async registration(
        data: CreateUserInputDto,
        expectedStatusCode: number = HTTP_STATUSES.NO_CONTENT_204,
    ): Promise<{ body: UserViewDto, response: any }> {
        // console.log('TEST - ⚙️ : - AuthTestManager - registration: req data', data)
        const response = await request(this.app.getHttpServer())
            .post(`/auth/registration`)
            .send(data)
            .set('User-Agent', 'TestDevice/1.0')
            // .auth('admin', 'qwerty')
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body:', response.body)
        return { body: response.body, response };
    }
    async login(
        access: string | null,
        refresh: string | null,
        data: { password: string, loginOrEmail: string },
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: number = HTTP_STATUSES.OK_200
    ): Promise<{ accessToken: string, refreshToken: string, response: any, body: string }> {
        // console.log('TEST - ⚙️ : - AuthTestManager - login: req data', data)
        const response = await request(this.app.getHttpServer())
            .post(`/auth/login`)
            .set('Authorization', `Bearer ${access}`)
            .set('Cookie', `refreshToken=${refresh}`)
            .send(data)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body: ', response.body)
        const accessToken = response.headers['authorization']?.split(' ')[1];
        const refreshToken = response.headers['set-cookie']?.[0]?.split(';')[0]?.split('=')[1];
        let body
        return {
            accessToken: response.body.accessToken,
            refreshToken,
            response,
            body: response.body.accessToken
        };
    }
    async logout(
        accessToken: string | null,
        refreshToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204
    ): Promise<{ status: number }> {
        // console.log('accessToken: - ⚙️', accessToken)
        // console.log('refreshToken: - ⚙️', refreshToken)
        const response = await request(this.app.getHttpServer())
            .post(`${SETTINGS.RouterPath.auth}/logout`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode);
        if (expectedStatusCode === HTTP_STATUSES.NO_CONTENT_204) {
            console.log('TEST - ⚙️ authTestManager logout: - response', response.body)
            const clearedCookies = response.headers['set-cookie'];
            expect(clearedCookies).toBeDefined();
            expect(clearedCookies[0]).toContain('refreshToken=;');
            return { status: HTTP_STATUSES.NO_CONTENT_204 }
        } else {
            return { status: response.status }
        }
    }
    async refreshToken(
        accessToken: string | null,
        refreshToken: string | null,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('TEST authTestManager refreshToken: - ⚙️req⚙️', refreshToken)
        const response = await request(this.app.getHttpServer())
            .post(`${SETTINGS.RouterPath.auth}/refresh-token`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ authTestManager refreshToken: - response', response.body)
        // Проверяем заголовок 'set-cookie'
        const setCookieHeader = response.headers['set-cookie'];
        // let extractedRefreshToken = setCookieHeader ? setCookieHeader[0] : null;
        let extractedRefreshToken: string = '';
        if (Array.isArray(setCookieHeader)) {
            // Если это массив строк
            extractedRefreshToken = setCookieHeader
                .find((cookie: string) => cookie.startsWith('refreshToken='))
                ?.split('=')[1]
                ?.split(';')[0];
        } else if (typeof setCookieHeader === 'string') {
            // Если это одна строка
            if (setCookieHeader.startsWith('refreshToken=')) {
                extractedRefreshToken = setCookieHeader
                    .split('=')[1]
                    .split(';')[0];
            }
        }
        // if(response.status === HTTP_STATUSES.CREATED_201){
        //     await contextTests.sessions.updateAccessRefreshTokenUsersStateTest({
        //         numUser: 0,
        //         numDevice: 0,
        //         accessToken: response.body.accessToken,
        //         refreshToken: extractedRefreshToken
        //     })
        // }
        return { response: response, refresh: extractedRefreshToken }
    }
    async me(
        accessToken: string,
        numUser: number,
        statusCode: number = HTTP_STATUSES.OK_200
    ): Promise<MeViewDto> {
        // console.log('TEST - ⚙️ : - AuthTestManager - accessToken', accessToken)
        const response = await request(this.app.getHttpServer())
            .get(`/auth/me`)
            .auth(accessToken, { type: 'bearer' })
            .set('User-Agent', 'TestDevice/1.0')
            .expect(statusCode);
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body', response.body)
        if (statusCode) {
            expect(response.body)
                .toEqual(
                    {
                        id: expect.any(String),
                        login: expect.any(String),
                        email: expect.any(String)
                    }
                )
        }
        // contextTests.users.addUserStateTest({ numUser, addUser: response.body });
        return response.body;
    }
    async createSeveralUsers(count: number): Promise<UserViewDto[]> {
        const usersPromises = [] as Promise<UserViewDto>[];
        for (let i = 0; i < count; ++i) {
            await delay(50);
            const { response } = await this.registration({
                login: `test` + i,
                email: `test${i}@gmail.com`,
                password: '123456789',
            });
            usersPromises.push(response);
        }
        return Promise.all(usersPromises);
    }
    async createAndLoginSeveralUsers(count: number): Promise<{ accessToken: string }[]> {
        const users = await this.createSeveralUsers(count);
        const loginPromises = users.map((user: UserViewDto) =>
            this.login(
                null,
                null,
                // count,
                // count,
                {
                    loginOrEmail: user.login,
                    password: '123456789'
                },

            ),
        );
        return await Promise.all(loginPromises);
    }
}