import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';

export class UserPhotosTestManager {
    constructor(private app: INestApplication) { }

    async getAllPhotos(
        userId: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.photos}/all/${userId}`)
            .expect(expectedStatusCode);
        let getEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async getPhotoById(
        photoId: string,
        expectedStatusCode: HttpStatusType = HttpStatus.OK) {
        // console.log('userPhotosTestManager: - getPhotoById photoId', photoId)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.photos}/${photoId}`)
            .expect(expectedStatusCode);
        // console.log('userPhotosTestManager: - getPhotoById response', response.body)
        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async createPhoto(
        data: any,
        accessToken: string,
        expectedStatusCode: HttpStatusType = HttpStatus.CREATED) {
        // console.log('userPhotosTestManager: - data1', data)
        let response
        if (data.userId === '' && data.albumName === '') {
            response = await request(this.app.getHttpServer())
                .post(`${SETTINGS.RouterPath.photos}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(data)
        } else {
            response = await request(this.app.getHttpServer())
                .post(`${SETTINGS.RouterPath.photos}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .field('userId', data.userId.toString() || '')
                .field('albumName', data.albumName !== undefined ? data.albumName.toString() : '')
                .attach('image', data.files.image ? data.files.image : '')
                .attach('miniature', data.files.miniature ? data.files.miniature : '')
                .expect(expectedStatusCode);
        }
        // console.log('userPhotosTestManager: - response', response.body)
        if (expectedStatusCode === HttpStatus.CREATED) {
            expect(response.body).toEqual(
                expect.objectContaining({
                    photoId: expect.any(String),
                    userId: data.userId,
                    albumId: expect.any(String),
                    image: expect.any(String),
                    miniature: expect.any(String),
                })
            );
        }
        return { response: response, createdEntity: response.body }
    }
    async updatePhoto(
        accessToken: string,
        photoId: string,
        files: any,
        data: any,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204
    ) {
        // console.log('UserPhotosTestManager: updatePhoto - data', data)

        let response
        if ((data.userId === '' || data.userId === undefined) &&
            (data.albumName === '' || data.albumName === undefined)) {
            // Простой .send — если нет данных
            response = await request(this.app.getHttpServer())
                .put(`${SETTINGS.RouterPath.photos}/${photoId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(data)
        } else {
            // console.log('userPhotosTestManager: - data else:', data)
            const req = request(this.app.getHttpServer())
                .put(`${SETTINGS.RouterPath.photos}/${photoId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                // .set('Content-Type', 'multipart/form-data') // 👈 вручную форсируем

                .field('imageName', data.imageName?.toString() ?? '')
                .field('miniatureName', data.miniatureName?.toString() ?? '')

                .field('userId', data.userId?.toString() ?? '')
                .field('albumId', data.albumId?.toString() ?? '')
                .field('albumName', data.albumName?.toString() ?? '')


            if (files?.image) {
                req.attach('image', files.image.path) // 👈 передаём путь, а не ReadStream
            }
            if (files?.miniature) {
                req.attach('miniature', files.miniature.path) // 👈 путь
            }
            response = await req.expect(expectedStatusCode)
        }
        // console.log('userPhotosTestManager: - response', response.body)
        let updateEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            updateEntity = response.body
        }
        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            updateEntity = []
        }
        return { response, updatedEntity: updateEntity }
    }
    async deletePhoto(
        photoId: string,
        accessToken: string,
        expectedStatusCode: HttpStatusType = HttpStatus.OK) {
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.photos}/${photoId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(expectedStatusCode);

        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
}