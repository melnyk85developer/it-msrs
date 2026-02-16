import { UAParser } from 'ua-parser-js';
import geoip, { Lookup } from 'geoip-lite';
import { UsersRepository } from '../../../user-accounts/users-infrastructure/users.repository';
import { ParseDeviceNameType } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserLoginUseCaseDto } from '../../auth-dto/user-login.use-case.dto';
import { UpdateLastSeenUserCommand } from 'src/modules/user-accounts/users-application/user-use-cases/update-last-seen-user.use-case';
import { CreateSessionCommand } from 'src/modules/user-sessions/sessions-application/sessions-use-cases/create-session.use-case';

export class UserLoginCommand {
    constructor(
        public dto: UserLoginUseCaseDto
    ) { }
}
export type UserLoginResult = {
    accessToken: string;
    refreshToken: string;
};
@CommandHandler(UserLoginCommand)
export class UserLoginUseCase
    implements ICommandHandler<UserLoginCommand, UserLoginResult> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private usersRepository: UsersRepository,
    ) { }
    async execute(command: UserLoginCommand): Promise<UserLoginResult> {
        const { ip, userAgent, userId, remember, refreshToken } = command.dto
        // console.log('AuthService → login: userId 👍', userId);
        // console.log('loginService: - ', ip, userAgent, refreshToken)
        // const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        const roleValues = user.systemUserData.roles.map(role => role.value);
        // console.log('loginService: - user', user)
        // console.log('loginService: - roleValues', roleValues)
        const isParse = await this._myParserService(ip, userAgent)

        const isLogin = await this.commandBus.execute<CreateSessionCommand, { accessToken: string, refreshToken: string }>(
            new CreateSessionCommand(
                {
                    userId,
                    ip,
                    osName: isParse.osName as string,
                    osVersion: isParse.osVersion as string,
                    browserName: isParse.browserName as string,
                    browserVersion: isParse.browserVersion as string,
                    device: isParse.device as string,
                    country: isParse.country as string,
                    city: isParse.city as string
                },
                remember,
                refreshToken as string,
                roleValues,
                user.systemUserData.isBanned,
                user.systemUserData.bannReason as string,
            )
        )
        
        // console.log('loginService: - isLogin RES', isLogin)
        const isUpdateLastSeen = await this.commandBus.execute<UpdateLastSeenUserCommand, string>(
            new UpdateLastSeenUserCommand(userId)
        );
        // console.log('loginService: - isUpdateLastSeen RES', isUpdateLastSeen)
        return {
            accessToken: isLogin.accessToken,
            refreshToken: isLogin.refreshToken
        };
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