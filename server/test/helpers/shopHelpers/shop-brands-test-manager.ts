import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { delay } from '../delay';
import { contextTests } from '../init-settings';
import { CreateShopTypeInputDto } from 'src/modules/shops-platform/shop-type/shop-type-dto/create-shop-type.input-dto';

export class ShopBrandsTestManager {
    constructor(private app: INestApplication) { }
    async getShopBrands(
        userId: string,
        accessToken: string,
        expectedStatusCode: number = HTTP_STATUSES.OK_200,
    ) {
        // console.log('TEST - ⚙️ : - AuthTestManager - registration: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.shopbrand}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(expectedStatusCode)

        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async getShopBrandById(
        brandId: string,
        accessToken: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: number = HTTP_STATUSES.OK_200
    ) {
        // console.log('TEST - ⚙️ : - AuthTestManager - login: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.shopbrand}/${brandId}`)
            .set('User-Agent', userAgent)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body: ', response.body)
        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async createShopBrands(
        shopType: CreateShopTypeInputDto,
        accessToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        const response = await request(this.app.getHttpServer())
            .post(SETTINGS.RouterPath.shopbrand)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(shopType)
            .expect(expectedStatusCode);

        // console.log('ShopTypesTestManager: - createShopTypes ⚙️ response.body', response.body)
        
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            expect(response.body.typeName).toEqual(shopType.typeName);
        }
        return { response: response, createdEntity: response.body }
    }
    async updateShopBrand(
        brandId: string,
        data: any,
        accessToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        // console.log('ShopTypesTestManager: - data ⚙️', data)
        const response = await request(this.app.getHttpServer())
            .put(`${SETTINGS.RouterPath.shopbrand}/${brandId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(expectedStatusCode);
        // console.log('ShopTypesTestManager: - ⚙️ response.body', response.body)

        let updateEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            updateEntity = response.body
        }
        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            updateEntity = []
        }
        return { response: response, updatedEntity: updateEntity }
    }
    async deleteShopBrand(
        brandId: string,
        accessToken: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('TEST authTestManager refreshToken: - ⚙️req⚙️', refreshToken)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.shopbrand}/${brandId}`)
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