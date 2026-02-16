import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import * as uuid from 'uuid';
import { SessionsRepository } from '../../sessions-infrastructure/session.repository';
import { TokenService } from 'src/modules/tokens/tokens-application/token-service';
import { CreateSessionDto } from '../../sessions-dto/create-sessions.domain.dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Session, type SessionModelType } from '../../sessions-domain/sessions.entity';
import { UpdateSessionCommand } from './update-session.use-case';

type CreateSessionDtoAndNewField = Omit<CreateSessionDto, 'roleValues' | 'deviceId' | 'lastActiveDate' | 'expirationDate'>

export class CreateSessionCommand {
    constructor(
        public dto: CreateSessionDtoAndNewField,
        public remember: boolean,
        public refreshToken: string,
        public roleValues: string[],
        public banned: boolean,
        public bannReason: string
    ) { }
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase
    implements ICommandHandler<CreateSessionCommand, { accessToken: string, refreshToken: string }> {
    constructor(
        @InjectModel(Session.name) private SessionModel: SessionModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private tokenService: TokenService,
        private sessionsRepository: SessionsRepository
    ) { }
    async execute(command: CreateSessionCommand): Promise<{ accessToken: string, refreshToken: string }> {
        const { ip, browserName, browserVersion, osName, osVersion, country, city, userId, device } = command.dto
        const { refreshToken, remember, roleValues, bannReason, banned, dto } = command
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
            return await this.commandBus.execute<UpdateSessionCommand, { accessToken: string; refreshToken: string; }>(
                new UpdateSessionCommand(
                    {
                        userId,
                        ip,
                        browserName,
                        browserVersion: browserVersion,
                        osName,
                        osVersion,
                        country,
                        city,
                        deviceId: existingSession.deviceId,
                        device,
                        remember,
                    },
                    refreshToken as string,
                    roleValues,
                    banned,
                    bannReason

                )
            );
        } else {
            let deviceId = uuid.v4()
            // console.log('UsersSessionService: - 🔥🔥🔥 Создаём новую сессию', deviceId)
            const { accessToken, refreshToken } = this.tokenService.generateTokens({
                id: userId,
                deviceId,
                roleValues,
                banned: banned,
                bannReason: bannReason
            },
                remember
            )
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
                remember: remember
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
}