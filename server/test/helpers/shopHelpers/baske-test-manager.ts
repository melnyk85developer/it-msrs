import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { delay } from '../delay';
import { contextTests } from '../init-settings';

export class ShopBasketTestManager {
    constructor(private app: INestApplication) { }
    async getBasket(
        dataBasket: any,
        accessToken: string,
        expectedStatusCode: number = HTTP_STATUSES.OK_200,
    ) {
        const { shopId, userId } = dataBasket
        // console.log('TEST - ⚙️ : - AuthTestManager - registration: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.basket}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .query({ shopId, userId })
            .expect(expectedStatusCode)
        let getBasket: any
        // console.log('usersTestManager: - ', response.body)
        if (expectedStatusCode === HttpStatus.OK) {
            getBasket = response.body
        }
        return { response: response, getBasket: response.body }
    }
    async getBasketById(
        basketId: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: number = HTTP_STATUSES.OK_200
    ) {
        // console.log('TEST - ⚙️ : - AuthTestManager - login: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.backetd}/${basketId}`)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body: ', response.body)
        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        // console.log('shopBasketTestManager getBasketById: res getEntity', getEntity)
        return { response: response, getEntity: getEntity }
    }
    async createBasket(
        data: any,
        accessToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        const response = await request(this.app.getHttpServer())
            .post(SETTINGS.RouterPath.basket)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(expectedStatusCode);

        // if (expectedStatusCode === HttpStatus.CREATED) {
        //     expect(response.body).toEqual(
        //         expect.objectContaining(data)
        //     )
        // }
        return { response: response, createdBasket: response.body }
    }
    async deleteBasket(
        basketId: string,
        accessToken: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('TEST authTestManager refreshToken: - ⚙️req⚙️', refreshToken)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.basket}/${basketId}`)
            .set('Authorization', `Bearer ${accessToken}`)
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