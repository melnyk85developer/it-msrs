import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Session, SessionDocument, type SessionModelType } from '../sessions-domain/sessions.entity';
import { DeleteResult } from 'mongoose';

@Injectable()
export class SessionsRepository {
    constructor(
        @InjectModel(Session.name) private SessionModel: SessionModelType
    ) { }

    async findDeviceByDeviceId(deviceId: string): Promise<SessionDocument | null> {
        return await this.SessionModel.findOne({
            deviceId,
            deletedAt: null,
        });
    }
    async findAllDeviceByUserId(userId: string): Promise<SessionDocument[] | null> {
        return await this.SessionModel.find({
            userId,
            // deletedAt: null,
        });
    }
    async findSessionByDeviceIdOrNotFoundFail(deviceId: string): Promise<SessionDocument> {
        const session = await this.findDeviceByDeviceId(deviceId);
        if (!session) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_SESSION_ID)
        }
        return session;
    }
    async findAllSessionsByUserIdOrNotFoundFail(userId: string): Promise<SessionDocument[]> {
        // console.log('SessionsRepository: userId 👽😡👽 ', userId)
        const session = await this.findAllDeviceByUserId(userId);
        // console.log('SessionsRepository: session 👽😡👽 ', session)

        if (!session) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_SESSION_ID)
        }
        return session;
    }
    async findAllSessions(userId: string): Promise<SessionDocument[]> {
        return this.SessionModel.find({ userId });
    }
    async save(session: SessionDocument) {
        await session.save();
    }
    async deleteSession(userId: string, deviceId: string): Promise<DeleteResult> {
        return this.SessionModel.deleteOne({ userId, deviceId });
    }
    async deleteAllSession(userId: string): Promise<DeleteResult> {
        return this.SessionModel.deleteMany({ userId });
    }
}