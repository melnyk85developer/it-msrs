import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { delay } from '../delay';
import { contextTests } from '../init-settings';
import { GetMerchandiseBrandQueryParams } from 'src/modules/shops-platform/merchandise-brand/merchandise-brand-dto/get-merchandise-brand-query-params.input-dto';
import { CreateMerchandiseBrandInputDto } from 'src/modules/shops-platform/merchandise-brand/merchandise-brand-dto/merchandise-brand.input-dto';
import { UpdateMerchandiseBrandInputDto } from 'src/modules/shops-platform/merchandise-brand/merchandise-brand-dto/update-input-merchandise-brand.dto';

export class MerchandiseBrandTestManager {
    constructor(private app: INestApplication) { }
    async getMerchandiseBrands(
        dataBrand: any,
        expectedStatusCode: number = HTTP_STATUSES.OK_200,
    ) {
        const { shopId } = dataBrand
        // console.log('TEST - ⚙️ : - AuthTestManager - registration: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.brands}`)
            .query(dataBrand)
            .expect(expectedStatusCode)
        let getBrands
        if (expectedStatusCode === HttpStatus.OK) {
            getBrands = response.body
        }
        return { response: response, getBrands: getBrands }
    }
    async getMerchandiseBrandById(
        brandId: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: number = HTTP_STATUSES.OK_200
    ) {
        // console.log('TEST - ⚙️ : - AuthTestManager - login: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.brands}/brand/${brandId}`)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body: ', response.body)
        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async createMerchandiseBrand(
        shopBrand: CreateMerchandiseBrandInputDto,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        const response = await request(this.app.getHttpServer())
            .post(SETTINGS.RouterPath.brands)
            .send(shopBrand)
            .expect(expectedStatusCode);

        if (expectedStatusCode === HttpStatus.CREATED) {
            expect(response.body).toEqual(
                expect.objectContaining(shopBrand)
            )
        }
        return { response: response, createdBrand: response.body }
    }
    async updateMerchandiseBrand(
        brandId: string,
        data: UpdateMerchandiseBrandInputDto,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        const response = await request(this.app.getHttpServer())
            .put(`${SETTINGS.RouterPath.brand}/${brandId}`)
            .send(data)
            .expect(expectedStatusCode);


        let updateBrand
        if (expectedStatusCode === HttpStatus.OK) {
            updateBrand = response.body
        }
        if (expectedStatusCode === HttpStatus.BAD_REQUEST) {
            updateBrand = []
        }
        return { response: response, updatedBrand: updateBrand }
    }
    async deleteMerchandiseBrand(
        brandId: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('TEST authTestManager refreshToken: - ⚙️req⚙️', refreshToken)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.brand}/${brandId}`)
            // .set('Authorization', `Bearer ${accessToken}`)
            // .set('Cookie', `refreshToken=${refreshToken}`)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ authTestManager refreshToken: - response', response.body)
        let deleteBrand
        if (expectedStatusCode === HttpStatus.OK) {
            deleteBrand = response.body
        }
        return { response: response, deleteBrand: deleteBrand }
    }
}