import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { TokenService } from 'src/modules/tokens/tokens-application/token-service';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { CreateSessionDto, UpdateSessionDto } from '../sessions-dto/create-sessions.domain.dto';
import { SessionsRepository } from '../sessions-infrastructure/session.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument, type SessionModelType } from '../sessions-domain/sessions.entity';
import { UserDocument } from 'src/modules/user.accounts/users-domain/user.entity';

@Injectable()
export class SessionService {
    constructor(
        @InjectModel(Session.name) private SessionModel: SessionModelType,
        private tokenService: TokenService,
        private sessionsRepository: SessionsRepository
    ) { }

    async createSessionService(dto: CreateSessionDtoAndNewField, refreshToken: string, roleValues: string[], banned: boolean, bannReason: string): Promise<any> {
        const { ip, browserName, browserVersion, osName, osVersion, country, city, userId, device } = dto
        // console.log('UsersSessionService: - createSessionsServices dto', dto)
        const devices = await this.sessionsRepository.findAllSessionsByUserIdOrNotFoundFail(userId);

        let userToken: any | null = null
        let existingSession: any | null = null
        if (refreshToken) {
            userToken = await this.tokenService.decodeRefreshToken(refreshToken);
            // console.log('🔥🔥 createSessionsServices - userToken:', userToken);
        }
        if (userId && refreshToken) {
            if (devices && devices.length && userToken) {
                // console.log('🔥 createSessionsServices - devices:', devices);
                existingSession = devices.find(
                    (session: { browserName: string | null; browserVersion: string | null; osName: string | null; osVersion: string | null; deviceId: string }) =>
                        session.browserName === browserName &&
                        session.browserVersion === browserVersion &&
                        session.osName === osName &&
                        session.osVersion === osVersion &&
                        session.deviceId === userToken.deviceId
                );
                // console.log('🔥 createSessionsServices - existingSession:', existingSession);
            }
        }
        if (existingSession) {
            // console.log('🔥 UsersSessionService: - Обновляем существующую сессию', existingSession)
            return await this.updateSessionService({
                userId,
                ip,
                browserName,
                browserVersion: browserVersion,
                osName,
                osVersion,
                country,
                city,
                deviceId: existingSession.deviceId,
                device
            },
                refreshToken as string,
                roleValues,
                banned,
                bannReason
            )
        } else {
            let deviceId = uuid.v4()
            console.log('UsersSessionService: - 🔥🔥🔥 Создаём новую сессию', deviceId)
            const { accessToken, refreshToken } = this.tokenService.generateTokens({
                id: userId,
                deviceId,
                roleValues,
                banned: banned,
                bannReason: bannReason
            })
            // console.log('UsersSessionService: - accessToken, refreshToken', accessToken, refreshToken)
            if (!accessToken || !refreshToken) {
                throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_TOKEN_CREATION_ERROR)
            }
            const userToken = await this.tokenService.validateRefreshToken(refreshToken);
            // console.log('SessionService: - userToken', userToken)
            const session = await this.SessionModel.createSessionInstance({
                ip,
                browserName,
                browserVersion,
                osName,
                osVersion,
                device,
                deviceId: userToken.deviceId,
                userId,
                country,
                city,
                lastActiveDate: Number(userToken.iat),
                expirationDate: Number(userToken.exp),
            });
            // console.log('SessionService: - session', session)
            await this.sessionsRepository.save(session);
            return { accessToken, refreshToken };

            // if (session) {

            // } else {
            //     throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_CREATION_ERROR)
            // }
        }
    }
    async updateSessionService(dto: UpdateSessionDtoDtoAndNewField, refresh: string, roleValues: string[], banned: boolean, bannReason: string): Promise<{ accessToken: string, refreshToken: string, isUpdatedSession: any }> {
        const { userId, ip, browserName, browserVersion, osName, osVersion, country, city, deviceId, device } = dto
        // console.log('updateSessionsServices: - dto', dto);
        const isSaveRefreshTokenBlackList = await this.tokenService.saveTokenBlackList(userId, refresh)
        if (isSaveRefreshTokenBlackList) {
            // console.log('updateSessionsServices: - isSaveRefreshTokenBlackList', isSaveRefreshTokenBlackList);
            const { accessToken, refreshToken } = this.tokenService.generateTokens({
                id: userId,
                deviceId,
                roleValues,
                banned: banned,
                bannReason: bannReason
            })
            const userToken = await this.tokenService.decodeRefreshToken(refreshToken);
            let session = await this.sessionsRepository.findSessionByDeviceIdOrNotFoundFail(userToken.deviceId);
            // console.log('updateSessionsServices: - userToken', userToken)
            // console.log('updateSessionsServices: - session', session)
            const newSession = {
                ip,
                browserName,
                browserVersion,
                osName,
                osVersion,
                country,
                city,
                userId,
                deviceId: userToken.deviceId,
                device,
                lastActiveDate: Number(userToken.iat),
                expirationDate: Number(userToken.exp),
            };
            session.updateSessionData(newSession)
            await this.sessionsRepository.save(session);
            return {
                accessToken,
                refreshToken,
                isUpdatedSession: newSession
            }

            // if (isUpdateLastSeen) {

            // } else {
            //     throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_UPDATION_ERROR)
            // }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST)
        }
    }
    async deleteSessionsByDeviceIdServices(userId: string, deviceId: string): Promise<{ statusCode: number; message: string; } | any> {
        const session = await this.findSessionByDeviceIdOrNotFoundServices(deviceId)
        // console.log('SessionService deleteSessionsByDeviceIdServices - session', session)
        if (session && String(session.userId) !== String(userId)) {
            // console.log('UsersSessionService deleteSessionsByDeviceIdServices - if', userSession.userId, userId)
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION)
        } else {
            const isDelete = await this.sessionsRepository.deleteSession(userId, deviceId);
            // console.log('UsersSessionService deleteSessionsByDeviceIdServices - isDelete', isDelete)
            if (isDelete) {
                return isDelete
            } else {
                throw new DomainException(INTERNAL_STATUS_CODE.SESSION_DELETION_ERROR)
            }
        }
    }
    async deleteAllSessionsServices(userId: string, deviceId: string, refreshToken: string): Promise<{ statusCode: number; message: string; } | any> {
        const isSessions = await this.sessionsRepository.findAllSessionsByUserIdOrNotFoundFail(userId);

        if (isSessions && isSessions.length > 0) {
            for (let i = 0; isSessions.length > i; i++) {
                if (isSessions[i].deviceId !== deviceId) {
                    await this.sessionsRepository.deleteSession(userId, deviceId);
                }
            }
        }
        console.log('SessionService deleteAllSessionsServices - isSessions.length', isSessions.length)
        return isSessions.length
    }

    async findSessionByDeviceIdOrNotFoundServices(deviceId: string): Promise<any> {
        return await this.sessionsRepository.findSessionByDeviceIdOrNotFoundFail(deviceId)
    }
    async findAllSessionsServices(userId: string): Promise<SessionDocument[]> {
        return await this.sessionsRepository.findAllSessionsByUserIdOrNotFoundFail(userId)
    }
}
type CreateSessionDtoAndNewField = Omit<CreateSessionDto, 'roleValues' | 'deviceId' | 'lastActiveDate' | 'expirationDate'>
type UpdateSessionDtoDtoAndNewField = Omit<UpdateSessionDto, 'lastActiveDate' | 'expirationDate'>