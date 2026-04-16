import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { delay } from '../delay';
import { contextTests } from '../init-settings';
import { CreateMerchandiseInputDto } from 'src/modules/shops-platform/merchandise/merchandise-dto/create-merchandise.input-dto';

export class MerchandiseTestManager {
    constructor(private app: INestApplication) { }
    async getMerchandise(
        dataMerchandise: any,
        expectedStatusCode: number = HTTP_STATUSES.OK_200,
    ) {
        const { shopId, typeId, brandId, page, limit } = dataMerchandise
        // console.log('TEST - ⚙️ : - AuthTestManager - registration: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.merchandise}`)
            .query({ shopId, typeId, brandId, page, limit })
            .expect(expectedStatusCode)

        let getMerchandise: any
        // console.log('usersTestManager: - ', response.body)
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            getMerchandise = response.body
        }
        return { response: response, getMerchandise: response.body }
    }
    async getMerchandiseById(
        merchandiseId: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: number = HTTP_STATUSES.OK_200
    ) {
        // console.log('TEST - ⚙️ : - AuthTestManager - login: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.merchandise}/${merchandiseId}`)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body: ', response.body)
        let getEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async createMerchandise(
        data: any,
        accessToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('MerchandiseTestManager: - data ⚙️', data)
        let response = await request(this.app.getHttpServer())
            .post(`${SETTINGS.RouterPath.merchandise}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)

        // if (data.shopId === '' && data.merchandiseName === '') {
        //     response = await request(this.app.getHttpServer())
        //         .post(`${SETTINGS.RouterPath.merchandise}`)
        //         .set('Authorization', `Bearer ${accessToken}`)
        //         .send(data)
        // } else {
        //     response = await request(this.app.getHttpServer())
        //         .post(`${SETTINGS.RouterPath.merchandise}`)
        //         .set('Authorization', `Bearer ${accessToken}`)
        //         .field('merchandiseName', data.merchandiseName)
        //         .field('price', data.price.toString())
        //         .field('brandId', data.brandId.toString())
        //         .field('typeId', data.typeId.toString())
        //         .field('shopId', data.shopId.toString())
        //         .field('info', JSON.stringify(data.info || []))
        //         .attach('image', data.image.path)
        //         .expect(expectedStatusCode);
        // }
        // if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
        //     const expectedData = {
        //         name: data.name,
        //         price: data.price,
        //         brandId: data.brandId,
        //         typeId: data.typeId,
        //         //   shopId: data.shopId,
        //         info: data.info || [],
        //         // Добавь сюда только те поля, которые нужны для проверки
        //     };
        //     expect(response.body).toMatchObject(expectedData);
        // }


        // console.log('MerchandiseTestManager: - response.body ⚙️', response.body)
        return { response, createdMerchandise: response.body };
    }
    async updateMerchandise(
        merchandiseId: string,
        data: any,
        accessToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        let response = await request(this.app.getHttpServer())
            .put(`${SETTINGS.RouterPath.merchandise}/${merchandiseId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(expectedStatusCode);

        // if (data.shopId === '' && data.merchandiseName === '') {
        //     console.log('MerchandiseTestManager updateMerchandise: - data ⚙️ IF', data)

        //     response = await request(this.app.getHttpServer())
        //         .put(`${SETTINGS.RouterPath.merchandise}/${merchandiseId}`)
        //         .set('Authorization', `Bearer ${accessToken}`)
        //         .send(data)
        //         .expect(expectedStatusCode);
        // } else {
        //     console.log('MerchandiseTestManager updateMerchandise: - data ⚙️ ELSE', data)

        //     response = await request(this.app.getHttpServer())
        //         .put(`${SETTINGS.RouterPath.merchandise}/${merchandiseId}`)
        //         .set('Authorization', `Bearer ${accessToken}`)
        //         .field('merchandiseName', data.merchandiseName)
        //         .field('price', data.price.toString())
        //         .field('rating', data.rating.toString())
        //         .field('quantity', data.quantity.toString())
        //         .field('brandId', data.brandId.toString())
        //         .field('typeId', data.typeId.toString())
        //         .field('shopId', data.shopId.toString())
        //         .field('info', JSON.stringify(data.info || []))
        //         .attach('image', data.merchandiseImgName.path)
        //         .expect(expectedStatusCode);
        // }

        let updateMerchandise
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            updateMerchandise = response.body
        }
        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            updateMerchandise = []
        }
        return { response: response, updatedEntity: updateMerchandise }
    }
    async deleteMerchandise(
        merchandiseId: string,
        accessToken: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('TEST authTestManager refreshToken: - ⚙️req⚙️', refreshToken)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.merchandise}/${merchandiseId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            // .set('Cookie', `refreshToken=${refreshToken}`)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ authTestManager refreshToken: - response', response.body)
        let deleteEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            deleteEntity = response.body
        }
        return { response: response, deleteEntity: deleteEntity }
    }
}