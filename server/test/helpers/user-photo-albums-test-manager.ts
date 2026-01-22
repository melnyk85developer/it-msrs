import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';

export class UserPhotoAlbumsTestManager {
    constructor(private app: INestApplication) { }

    async getAllPhotoAlbums(
        userId: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.photoalbums}/all/${userId}`)
            .expect(expectedStatusCode);
        let getEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async getPhotoAlbumById(
        albumId: string,
        expectedStatusCode: HttpStatusType = HttpStatus.OK) {
        // console.log('userPhotosTestManager: - getPhotoAlbumById albumId', albumId)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.photoalbums}/${albumId}`)
            .expect(expectedStatusCode);
        // console.log('userPhotosTestManager: - getPhotoById response', response.body)
        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async createPhotoAlbum(
        data: any,
        accessToken: string,
        expectedStatusCode: HttpStatusType = HttpStatus.CREATED) {

        let response
        if (data.userId === '' && data.albumName === '') {
            console.log('userPhotosTestManager: - data1', data.albumName)
            response = await request(this.app.getHttpServer())
                .post(`${SETTINGS.RouterPath.photoalbums}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(data)
        } else {
            console.log('userPhotosTestManager: - data2', data.albumName)
            response = await request(this.app.getHttpServer())
                .post(`${SETTINGS.RouterPath.photoalbums}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .field('userId', data.userId.toString() || '')
                .field('albumName', data.albumName !== undefined ? data.albumName.toString() : '')
                .attach('albumCoverFile', data.files.albumCoverFile ? data.files.albumCoverFile : '')
                .expect(expectedStatusCode);
        }
        console.log('userPhotosTestManager: - response', response.body)
        if (expectedStatusCode === HttpStatus.CREATED) {
            expect(response.body).toEqual(
                expect.objectContaining({
                    albumId: expect.any(String),
                    albumName: expect.any(String),
                    albumCoverName: expect.any(String),
                    userId: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                })
            );
        }
        return { response: response, createdEntity: response.body }
    }
    async updatePhotoAlbum(
        accessToken: string,
        albumId: string,
        files: any,
        data: any,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204
    ) {
        console.log('UserPhotosTestManager: updatePhoto - data', data)

        let response
        if ((data.userId === '' || data.userId === undefined) &&
            (data.albumName === '' || data.albumName === undefined)) {
            // Простой .send — если нет данных
            response = await request(this.app.getHttpServer())
                .put(`${SETTINGS.RouterPath.photoalbums}/${albumId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(data)
        } else {
            // console.log('userPhotosTestManager: - data else:', data)
            const req = request(this.app.getHttpServer())
                .put(`${SETTINGS.RouterPath.photoalbums}/${albumId}`)
                .set('Authorization', `Bearer ${accessToken}`)

                .field('userId', data.userId?.toString() ?? '')
                .field('albumId', data.albumId?.toString() ?? '')
                .field('albumCoverName', data.albumCoverName?.toString() ?? '')
                .field('albumName', data.albumName?.toString() ?? '')


            if (files?.albumCoverFile) {
                req.attach('albumCoverFile', files.albumCoverFile.path) // 👈 передаём путь, а не ReadStream
            }
            response = await req.expect(expectedStatusCode)
        }
        console.log('userPhotosTestManager: - response', response.body)
        let updateEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            updateEntity = response.body
        }
        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            updateEntity = []
        }
        return { response, updatedEntity: updateEntity }
    }
    async deletePhotoAlbum(
        albumId: string,
        accessToken: string,
        expectedStatusCode: HttpStatusType = HttpStatus.OK) {
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.photoalbums}/${albumId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(expectedStatusCode);

        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
}