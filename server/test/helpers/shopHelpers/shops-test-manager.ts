import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { delay } from '../delay';
import { contextTests } from '../init-settings';

export class ShopTestManager {
    constructor(private app: INestApplication) { }
    async getShops(
        userId: string,
        expectedStatusCode: number = HTTP_STATUSES.OK_200,
    ) {
        // console.log('TEST - ⚙️ : - AuthTestManager - registration: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.myshops}/${userId}`)
            .expect(expectedStatusCode)

        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async getShopById(
        shopId: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: number = HTTP_STATUSES.OK_200
    ) {
        // console.log('TEST - ⚙️ : - AuthTestManager - login: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.myshop}/${shopId}`)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body: ', response.body)
        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async createShop(
        data: any,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        const response = await request(this.app.getHttpServer())
            .post(SETTINGS.RouterPath.myshop)
            .send(data)
            .expect(expectedStatusCode);

        if (expectedStatusCode === HttpStatus.CREATED) {
            expect(response.body).toEqual(
                expect.objectContaining(data)
            )
        }
        return { response: response, createdShop: response.body }
    }
    async updateShop(
        shopId: string,
        data: any,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        const response = await request(this.app.getHttpServer())
            .put(`${SETTINGS.RouterPath.myshops}/${shopId}`)
            .send(data)
            .expect(expectedStatusCode);

        let updateEntity
        if (expectedStatusCode === HttpStatus.OK) {
            updateEntity = response.body
        }
        if (expectedStatusCode === HttpStatus.BAD_REQUEST) {
            updateEntity = []
        }
        return { response: response, updatedEntity: updateEntity }
    }
    async deleteShop(
        shopId: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('TEST authTestManager refreshToken: - ⚙️req⚙️', refreshToken)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.myshops}/${shopId}`)
            // .set('Authorization', `Bearer ${accessToken}`)
            // .set('Cookie', `refreshToken=${refreshToken}`)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ authTestManager refreshToken: - response', response.body)
        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
}