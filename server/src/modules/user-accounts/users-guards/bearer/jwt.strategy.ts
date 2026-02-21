import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users-infrastructure/users.repository';
import { UserContextDto } from '../dto/user-context.dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { UpdateLastSeenUserCommand } from '../../users-application/user-use-cases/update-last-seen-user.use-case';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { TokenRepository } from 'src/modules/tokens/tokens-infrastructure/token.repository';
import { SessionsRepository } from 'src/modules/user-sessions/sessions-infrastructure/session.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,

        private usersRepository: UsersRepository,
        private configService: ConfigService,
        private tokenRepository: TokenRepository,
        private sessionsRepository: SessionsRepository
    ) {
        const secret = configService.get('JWT_ACCESS_SECRET');
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: { id: string, iat: number, exp: number }): Promise<UserContextDto | null> {
        // console.log('🔥 JwtStrategy: - payload', payload)

        const user = await this.usersRepository.findById(payload.id);
        if (!user || user.systemUserData.isBanned) {
            // console.log('🔥 JwtStrategy: - user', user)
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED)
            // return null;
        }
        const isToken = await this.tokenRepository.findTokenById(payload.id)
        if (isToken) {
            // console.log('🔥 JwtStrategy: - isToken', isToken)
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST)
            // return null;
        }
        const devices = await this.sessionsRepository.findAllSessionsByUserIdOrNotFoundFail(payload.id)
        if (!devices) {
            // console.log('🔥 JwtStrategy: - devices', devices)
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_SESSION_ID)
            // return null;
        }
        const sessionExists = devices.some(d => d.userId === payload.id && Number(d.lastActiveDate) === Number(payload.iat))
        // console.log('🔥 JwtStrategy: - sessionExists', sessionExists)
        if (!sessionExists) {
            // console.log('JwtAuthGuard: СУКА 😡 Сессия токена не найдена/обновлена');
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_SESSION_ID)
            // return null;
        }
        const isUpdateLastSeen = await this.commandBus.execute<UpdateLastSeenUserCommand, string>(
            new UpdateLastSeenUserCommand(payload.id),
        );
        // console.log('🔥 JwtStrategy: - sessionExists', sessionExists)
        if (!isUpdateLastSeen) {
            // console.log('🔥 JwtStrategy: - isUpdateLastSeen', isUpdateLastSeen)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST)
            // return null;
        }
        return { id: user.id };
    }
}