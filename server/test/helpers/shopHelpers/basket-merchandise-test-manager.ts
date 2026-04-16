import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { delay } from '../delay';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { contextTests } from '../init-settings';

export class ShopBasketMerchandiseTestManager {
    constructor(private app: INestApplication) { }

    async getAllBasketsMerchandise(
        dataBasket: any,
        accessToken: string,
        expectedStatusCode: number = HTTP_STATUSES.OK_200,
    ) {
        const { basketId, shopId } = dataBasket
        // console.log('TEST - ⚙️ : - AuthTestManager - registration: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`/basket-merchandise/all`)
            .set('Authorization', `Bearer ${accessToken}`)
            .query({ basketId, shopId })
            .expect(expectedStatusCode)
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body:', response.body)
        let getBasket: any
        // console.log('shopBasketDeviceTestManager: - ', response.body)
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            getBasket = response.body
        }
        return { response: response, getBasketMerchandise: response.body }
    }
    async getBasketMerchandiseById(
        basketMerchandiseId: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: number = HTTP_STATUSES.OK_200
    ) {
        // console.log('TEST - ⚙️ : - AuthTestManager - login: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`/basket-merchandise/${basketMerchandiseId}`)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body: ', response.body)
        let getEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async createBasketMerchandise(
        data: any,
        accessToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        const response = await request(this.app.getHttpServer())
            .post(`/basket-merchandise`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(expectedStatusCode);

        // console.log('createBasketMerchandise: - ⚙️ response.body', response.body)

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            expect(response.body.basketId).toEqual(data.basketId);
            expect(response.body.merchandiseId).toEqual(data.merchandiseId);
            expect(response.body.merchandiseName).toEqual(data.merchandiseName);
            expect(response.body.price).toEqual(data.price);
            expect(response.body.quantity).toEqual(data.quantity);
        }
        return { response: response, createdBasketMerchandise: response.body }
    }
    async deleteBasketMerchandise(
        basketMerchandiseId: string,
        accessToken: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('TEST authTestManager refreshToken: - ⚙️req⚙️', refreshToken)
        const response = await request(this.app.getHttpServer())
            .delete(`/basket-merchandise/${basketMerchandiseId}`)
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