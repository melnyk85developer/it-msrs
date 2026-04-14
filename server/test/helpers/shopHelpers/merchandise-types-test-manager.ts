import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { delay } from '../delay';
import { contextTests } from '../init-settings';
import { CreateMerchandiseTypeInputDto } from 'src/modules/shops-platform/merchandise-type/merchandise-type-dto/merchandise-type.input-dto';
import { GetMerchandiseTypeQueryParams } from 'src/modules/shops-platform/merchandise-type/merchandise-type-dto/get-merchandise-type-query-params.input-dto';

export class MerchandiseTypesTestManager {
    constructor(private app: INestApplication) { }
    async getAllMerchandiseTypes(
        dataMerchandise: any,
        expectedStatusCode: number = HTTP_STATUSES.OK_200,
    ) {
        const { shopId, typeId, brandId, pageNumber, pageSize, searchMerchandiseType } = dataMerchandise
        // console.log('TEST - ⚙️ : - AuthTestManager - registration: req data', data)
        const response = await request(this.app.getHttpServer())
            .get('/merchandise-type/types')
            .query(dataMerchandise)
            .expect(expectedStatusCode)

        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async getMerchandiseTypeById(
        typeId: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: number = HTTP_STATUSES.OK_200
    ) {
        // console.log('TEST - ⚙️ : - AuthTestManager - login: req data', data)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.merchandise}/${typeId}`)
            .set('User-Agent', userAgent)
            .expect(expectedStatusCode);
        // console.log('TEST - ⚙️ : - AuthTestManager - response.body: ', response.body)
        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async createMerchandiseType(
        type: CreateMerchandiseTypeInputDto,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        const response = await request(this.app.getHttpServer())
            .post(SETTINGS.RouterPath.types)
            .send(type)
            .expect(expectedStatusCode);

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            // console.log('shopsTypesTestManager: - body', response.body)
            expect(response.body).toEqual(
                expect.objectContaining(type)
            )
        }
        return { response: response, createdEntity: response.body }
    }
    async updateMerchandiseType(
        typeId: string,
        data: any,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('accessToken: - ⚙️', accessToken)
        const response = await request(this.app.getHttpServer())
            .put(`${SETTINGS.RouterPath.types}/${typeId}`)
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
    async deleteMerchandiseTypes(
        typeId: string,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('TEST authTestManager refreshToken: - ⚙️req⚙️', refreshToken)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.types}/${typeId}`)
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