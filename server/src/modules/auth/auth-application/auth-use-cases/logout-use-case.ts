import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { TokenService } from 'src/modules/tokens/tokens-application/token-service';
import { UserLogoutUseCaseDto } from '../../auth-dto/user-logout.use-case.dto';
import { SessionsRepository } from 'src/modules/user-sessions/sessions-infrastructure/session.repository';
import { TokenRepository } from 'src/modules/tokens/tokens-infrastructure/token.repository';
import { SaveTokenBlackListCommand } from 'src/modules/tokens/tokens-application/tokens-use-cases/save-token-black-list.use-case';

export class UserLogoutCommand {
    constructor(
        public dto: UserLogoutUseCaseDto
    ) { }
}
@CommandHandler(UserLogoutCommand)
export class UserLogoutUseCase
    implements ICommandHandler<UserLogoutCommand, boolean> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private tokenService: TokenService,
        private tokenRepository: TokenRepository,
        private sessionsRepository: SessionsRepository,
    ) { }
    async execute(command: UserLogoutCommand): Promise<boolean> {
        const { refreshToken, refreshTokenPayload } = command.dto
        // console.log('🔥🔥 AuthService: logoutService - refreshTokenPayload:', refreshTokenPayload);
        const isToken = await this.tokenRepository.findTokenById(refreshTokenPayload.id)
        if (isToken) {
            // console.log('🔥🔥 AuthService: logoutService - isToken:', isToken);
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST)
        }
        const isSave = await this.commandBus.execute<SaveTokenBlackListCommand, string>(
            new SaveTokenBlackListCommand(
                refreshTokenPayload.id,
                refreshToken
            )
        );
        if (isSave) {
            // console.log('🔥🔥 AuthService: logoutService - isSave:', isSave);
            const isDelete = await this.sessionsRepository.deleteSession(
                refreshTokenPayload.id,
                refreshTokenPayload.deviceId
            );
            if (isDelete.acknowledged) {
                // console.log('🔥🔥 AuthService: logoutService - isDelete.acknowledged:', isDelete.acknowledged);
                return isDelete.acknowledged
            } else {
                throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST)
            }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST)
        }
    }
}