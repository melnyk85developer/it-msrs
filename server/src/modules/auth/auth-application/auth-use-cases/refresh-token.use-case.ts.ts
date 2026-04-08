import { UAParser } from 'ua-parser-js';
import geoip, { Lookup } from 'geoip-lite';
import { UsersRepository } from '../../../user-accounts/users-infrastructure/users.repository';
import { ParseDeviceNameType } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { UserRefreshTokenUseCaseDto } from '../../auth-dto/user-refresh-token.use-case.dto';
import { SessionsRepository } from 'src/modules/user-sessions/sessions-infrastructure/session.repository';
import { UpdateLastSeenUserCommand } from 'src/modules/user-accounts/users-application/user-use-cases/update-last-seen-user.use-case';
import { UpdateSessionCommand } from 'src/modules/user-sessions/sessions-application/sessions-use-cases/update-session.use-case';

export class RefreshTokenCommand {
    constructor(
        public dto: UserRefreshTokenUseCaseDto
    ) { }
}
export type RefreshTokenResult = {
    accessToken: string;
    refreshToken: string;
};
@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
    implements ICommandHandler<RefreshTokenCommand, RefreshTokenResult> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private sessionsRepository: SessionsRepository,
        private usersRepository: UsersRepository,
    ) { }
    async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
        const { ip, userAgent, refreshToken, refreshTokenPayload } = command.dto
        const isSessionExpired = (expirationDate: number): boolean => {
            const currentDate = Date.now() / 1000;
            return expirationDate < currentDate;
        };
        // console.log('🔥🔥 refreshService - refreshTokenPayload:', refreshTokenPayload);
        // console.log('🔥🔥 refreshService - refreshToken:', refreshToken);
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(refreshTokenPayload.id);
        const devices = await this.sessionsRepository.findAllSessionsByUserIdOrNotFoundFail(refreshTokenPayload.id);
        // console.log('🔥🔥 refreshService - devices:', devices);
        const device = devices.find(d => d.deviceId === refreshTokenPayload.deviceId)
        // console.log('🔥🔥 refreshService - device:', device);
        if (!device) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_SESSION_ID)
        }
        // if(userAgent !== device){
        //     console.error('Нарушена безопасность: userAgent !== device !!! Это означает, что произошла смена устройства при обновлении токена!')
        // }
        const noExpSession = !isSessionExpired(Number(device.expirationDate))
        // console.log('🔥🔥 refreshService - noExpSession:', noExpSession);
        // console.log('refreshTokenOrSessionService: - device.lastActiveDate IF', Number(device.lastActiveDate) === Number(userData.iat))

        if (noExpSession && Number(device.lastActiveDate) === Number(refreshTokenPayload.iat)) {
            const isParse = await this._myParserService(ip, userAgent)
            const roleValues = user.systemUserData.adminRoles.map(role => role.value);

            const isUpdatedSession = await this.commandBus.execute<UpdateSessionCommand, { accessToken: string, refreshToken: string }>(
                new UpdateSessionCommand(
                    {
                        userId: user.id,
                        ip,
                        browserName: isParse.browserName,
                        browserVersion: isParse.browserVersion,
                        osName: isParse.osName,
                        osVersion: isParse.osVersion,
                        country: isParse.country,
                        city: isParse.city,
                        device: isParse.device,
                        deviceId: refreshTokenPayload.deviceId,
                        remember: device.remember,
                    },
                    refreshToken as string,
                    roleValues,
                    user.systemUserData.isBanned,
                    user.systemUserData.bannReason as string,
                )
            )
            // console.log('🔥🔥 refreshService - isUpdatedSession:', isUpdatedSession);
            const isUpdateLastSeen = await this.commandBus.execute<UpdateLastSeenUserCommand, string>(
                new UpdateLastSeenUserCommand(user.id),
            );
            return { accessToken: isUpdatedSession.accessToken, refreshToken: isUpdatedSession.refreshToken }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
        }
    }
    private async _myParserService(ip: string, userAgent: string): Promise<ParseDeviceNameType> {
        const parser = new UAParser(userAgent);
        const uaResult = parser.getResult();
        const osName = uaResult.os.name || null;
        const osVersion = uaResult.os.version || null;
        const browserName = uaResult.browser.name || null;
        const browserVersion = uaResult.browser.version || null;
        const device = uaResult.device.type || null;
        const geo: Lookup | null = geoip.lookup(ip);
        const country = geo ? geo.country : null;
        const city = geo ? geo.city : null;

        return { osName, osVersion, browserName, browserVersion, device, country, city }
    }
}