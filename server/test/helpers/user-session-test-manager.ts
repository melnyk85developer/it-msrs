import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { CreateUserInputDto } from 'src/modules/user.accounts/users-dto/users.input-dto';

export class UserSessionTestManager {
    constructor(private app: INestApplication) { }

    async getAllUserSessionByUserId(
        accessToken: string | null,
        refreshToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        // console.log('getAllUserSessionByUserId: - ', accessToken, refreshToken)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.security}/devices`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        // console.log('usersTestManager - res', response.status)
        let arrSessions = response.body
        if (response.status === HTTP_STATUSES.OK_200) {
            // expect(Array.isArray(arrSessions)).toBe(true);
            expect(arrSessions.items).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        ip: expect.any(String),
                        browserName: expect.any(String),
                        browserVersion: expect.any(String),
                        osName: expect.any(String),
                        osVersion: expect.any(String),
                        country: null,
                        city: null,
                        device: expect.any(String),
                        userId: expect.any(String),
                        deviceId: expect.any(String),
                        expirationDate: expect.any(Number),
                        lastActiveDate: expect.any(Number)
                    })
                ])
            );
            return { response: response.body, arrSessions: arrSessions }
        }else{
            return { response: response.body, arrSessions: arrSessions }
        }
    }
    async getSessionUserById(
        deviceId: string | null,
        accessToken: string,
        refreshToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.security}/devices/${deviceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', id)
        return { response: response, resSessionUserById: response.body }
    }
    async updateUserSession(
        id: string,
        data: CreateUserInputDto,
        codedAuth: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        // console.log('usersTestManager - updateUser data, codedAuth', data, codedAuth)
        const response = await request(this.app.getHttpServer())
            .put(`${SETTINGS.RouterPath.users}/${id}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Basic ${codedAuth}`)
            .send(data)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - updateUserSession response.body', response.body)
        let updateUser
        // accessToken: string | undefined = undefined,
        // .set('Authorization', `Bearer ${accessToken}`)
        // console.log('usersTestManager - ', accessToken)
        if (expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401) { expect(expectedStatusCode) }
        if (expectedStatusCode === HTTP_STATUSES.NO_CONTENT_204) {
            updateUser = response.body;
        }
        return { response: response, updateUser: updateUser }
    }
    async deleteUserSessions(
        accessToken: string | null,
        refreshToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        // console.log('deleteUserSessions - res accessToken', accessToken)
        // console.log('deleteUserSessions - res refreshToken', refreshToken)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.security}/devices`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        let isDeleted = response.body
        return { response: response, isDeleted: isDeleted }
    }
    async deleteSessionByDeviceId(
        deviceId: string,
        accessToken: string | null,
        refreshToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        // console.log('deleteSessionByDeviceId: - deviceId, accessToken, refreshToken', deviceId, accessToken, refreshToken)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.security}/devices/${deviceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        return { response: response, deleteUser: response.body }
    }
    async getAllUsersSessions(
        accessToken: string,
        refreshToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.security}/devices-all`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        return { response: response, getAllUserSession: response.body }
    }
}