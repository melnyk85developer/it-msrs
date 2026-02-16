import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { UpdateSessionDto } from '../../sessions-dto/create-sessions.domain.dto';
import { SaveTokenBlackListCommand } from 'src/modules/tokens/tokens-application/tokens-use-cases/save-token-black-list.use-case';
import { TokenService } from 'src/modules/tokens/tokens-application/token-service';
import { SessionsRepository } from '../../sessions-infrastructure/session.repository';

export class UpdateSessionCommand {
    constructor(
        public dto: UpdateSessionDtoDtoAndNewField,
        public refresh: string,
        public roleValues: string[],
        public banned: boolean,
        public bannReason: string
    ) { }
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase
    implements ICommandHandler<UpdateSessionCommand, { accessToken: string, refreshToken: string, isUpdatedSession: any }> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private tokenService: TokenService,
        private sessionsRepository: SessionsRepository
    ) { }
    async execute(command: UpdateSessionCommand): Promise<{ accessToken: string, refreshToken: string, isUpdatedSession: any }> {
        const { refresh, roleValues, bannReason, banned, dto } = command;
        const { userId, ip, browserName, browserVersion, osName, osVersion, country, city, deviceId, device, remember } = dto
        // console.log('updateSessionsServices: - dto', dto);

        const isSaveRefreshTokenBlackList = await this.commandBus.execute<SaveTokenBlackListCommand, string>(
            new SaveTokenBlackListCommand(
                userId,
                refresh
            )
        );

        if (isSaveRefreshTokenBlackList) {
            // console.log('updateSessionsServices: - isSaveRefreshTokenBlackList', isSaveRefreshTokenBlackList);
            const { accessToken, refreshToken } = this.tokenService.generateTokens({
                id: userId,
                deviceId,
                roleValues,
                banned: banned,
                bannReason: bannReason
            },
                remember
            )
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
                remember
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
}
type UpdateSessionDtoDtoAndNewField = Omit<UpdateSessionDto, 'lastActiveDate' | 'expirationDate'>