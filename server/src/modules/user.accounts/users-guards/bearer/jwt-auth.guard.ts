import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { DomainException } from 'src/core/exceptions/domain-exceptions';

@Injectable()
export class AuthAccessGuard extends AuthGuard('jwt') {
    handleRequest(err, user) {
        if (err || !user) {
            // console.log('JwtAuthGuard: 😡 user, err', user, err)
            throw new DomainException(DomainExceptionCode.Unauthorized);
        }
        return user;
    }
}