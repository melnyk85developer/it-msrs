import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { HTTP_STATUSES, HttpStatusType } from '../../src/core/utils/utils';
import { SETTINGS } from '../../src/core/settings';

export class UserMessagesTestManager {
    constructor(private app: INestApplication) { }

    async getAllInterlocutors(
        accessToken: string,
        refreshToken: string,
        userAgent: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.messages}/interlocutors`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .set('User-Agent', `${userAgent}`)
            .expect(expectedStatusCode);

        // console.log('TEST UserMessagesTestManager - response.body:', response.body)
        return { response: response, getAllInterlocutors: response.body }
    }
    async getInterlocutorById(
        accessToken: string,
        refreshToken: string,
        dialogId: string,
        senderId: string,
        receiverId: string | undefined,
        userAgent: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        // console.log('TEST userMessagesTestManager - dialogId, senderId, receiverId', dialogId, senderId, receiverId)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.messages}/dialog/${dialogId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .query({ senderId, receiverId })
            .set('User-Agent', `${userAgent}`)
            .expect(expectedStatusCode);
        // console.log('TEST userMessagesTestManager - BODY ', response.body.allMsg)
        // console.log('TEST userMessagesTestManager - BODY ', response.body)
        return { response: response, getEntity: response.body }
    }
    async createMessage(
        accessToken: string,
        refreshToken: string,
        data: any,
        userAgent: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('TEST userMessagesTestManager - data req', data)
        // console.log('TEST userMessagesTestManager - accessToken req', accessToken)
        // console.log('TEST userMessagesTestManager - refreshToken req', refreshToken)
        let response
        if (
            !data.attachments ||
            !data.localId ||
            !data.message ||
            !data.senderId ||
            !data.receiverId
        ) {
            // console.log('TEST userMessagesTestManager - data req1', data)
            response = await request(this.app.getHttpServer())
                .post(SETTINGS.RouterPath.messages)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .send(data)
                .set('User-Agent', `${userAgent}`)
                .expect(expectedStatusCode);
        } else {
            // console.log('TEST userMessagesTestManager - data req2', data)
            const req = request(this.app.getHttpServer())
                .post(SETTINGS.RouterPath.messages)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .set('User-Agent', `${userAgent}`)
                .field('localId', data.localId.toString())
                .field('message', data.message.toString())
                .field('senderId', data.senderId.toString())
                .field('receiverId', data.receiverId.toString())

            if (data.replyToMessageId !== undefined && data.replyToMessageId !== null) {
                req.field('replyToMessageId', data.replyToMessageId.toString());
            }
            if (data.attachments) {
                req.attach('attachments', data.attachments);
            }
            response = await req.expect(expectedStatusCode)
        }
        // console.log('TEST userMessagesTestManager - BODY res', response.body);
        return { response: response, createdMessage: response.body }
    }
    async updateMessage(
        accessToken: string,
        refreshToken: string,
        data: any,
        userAgent: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        // console.log('TEST usersTestManager - data ', data)
        let response
        if (
            !data.attachments ||
            !data.localId ||
            !data.message ||
            !data.senderId ||
            !data.receiverId
        ) {
            // console.log('TEST usersTestManager - data1 ', data)
            response = await request(this.app.getHttpServer())
                .put(`${SETTINGS.RouterPath.messages}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .send(data)
                .set('User-Agent', `${userAgent}`)
                .expect(expectedStatusCode);
        } else {
            // console.log('TEST usersTestManager - data2 ', data)
            const req = request(this.app.getHttpServer())
                .put(`${SETTINGS.RouterPath.messages}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .field('localId', String(data.localId ?? ''))
                .field('message', String(data.message ?? ''))
                .field('senderId', String(data.senderId ?? ''))
                .field('receiverId', String(data.receiverId ?? ''))
                .field('replyToMessageId', String(data.replyToMessageId ?? ''))
                .set('User-Agent', `${userAgent}`)

            // .field('read', String(data.read))
            // .field('createdAt', String(data.createdAt ?? ''))
            // .attach('attachments', data.attachments ?? '')

            if (data.replyToMessageId !== undefined && data.replyToMessageId !== null) {
                req.field('replyToMessageId', data.replyToMessageId.toString());
            }
            if (data.attachments) {
                req.attach('attachments', data.attachments);
            }
            response = await req.expect(expectedStatusCode)
        }
        // console.log('TEST userMessagesTestManager - response.body ', response.body)
        let updateEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            updateEntity = response.body
        }
        return { response: response, updatedEntity: updateEntity }
    }
    async updateRead(
        accessToken: string,
        refreshToken: string,
        data: any,
        userAgent: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        // console.log('TEST usersTestManager - data ', data)
        const response = await request(this.app.getHttpServer())
            .put(`${SETTINGS.RouterPath.messages}/read`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .send(data)
            .set('User-Agent', `${userAgent}`)
            .expect(expectedStatusCode);
        // console.log('TEST userMessagesTestManager - response.body ', response.body)
        let updateEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            updateEntity = response.body
        }
        return { response: response, updatedEntity: updateEntity }
    }
    async deleteMessageById(
        accessToken: string,
        refreshToken: string,
        msgId: string,
        deleteOption: string,
        userAgent: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        // console.log('TEST userMessagesTestManager - msgId ', msgId)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.messages}/${msgId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .query({ deleteOption })
            .set('User-Agent', `${userAgent}`)
            .expect(expectedStatusCode);
        // console.log('TEST userMessagesTestManager - response.body ', response.body)
        let getEntity
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
    async deleteAllMessage(
        accessToken: string,
        refreshToken: string,
        data: { senderId: string, receiverId: string, deleteOption: 'all' | 'me' },
        userAgent: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        // console.log('TEST userMessagesTestManager - data ', data)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.messages}/all`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .query(data)
            .set('User-Agent', `${userAgent}`)
            .expect(expectedStatusCode);
        // console.log('TEST userMessagesTestManager - response.body ', response.body)
        return { response: response, deleteEntity: response.body }
    }
    async deleteDialog(
        accessToken: string,
        refreshToken: string,
        dialogId: string,
        userAgent: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        // console.log('TEST userMessagesTestManager - dialogId ', dialogId)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.messages}/dialog/${dialogId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .set('User-Agent', `${userAgent}`)
            .expect(expectedStatusCode);
        // console.log('TEST userMessagesTestManager - response.body ', response.body)
        return { response: response, deleteEntity: response.body }
    }
}

