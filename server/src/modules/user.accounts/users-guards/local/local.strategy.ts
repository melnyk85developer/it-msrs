import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { UserContextDto } from '../dto/user-context.dto';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { AuthService } from '../../../auth/auth-application/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        // Меняем обратно на ваше имя поля!
        super({ usernameField: 'loginOrEmail' });
        // console.log('LocalStrategy.validate → 👍👍👍')
    }

    //validate возвращает то, что впоследствии будет записано в req.user
    async validate(username: string, password: string): Promise<UserContextDto> {
        // console.log('LocalStrategy.validate → username, password 👍', username, password);
        const user = await this.authService.validateUserService(username, password);
        if (!user) {
            throw new DomainException(DomainExceptionCode.Unauthorized);
        }

        return user;
    }
}