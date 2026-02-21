import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../users-infrastructure/users.repository';

@Injectable()
export class BasicAuthGuard implements CanActivate {
    private readonly validUsername = 'admin';
    private readonly validPassword = 'qwerty';

    constructor(
        private reflector: Reflector,
        private usersRepository: UsersRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        // console.log('BasicAuthGuard: authHeader 😡 ', authHeader)

        //https://docs.nestjs.com/security/authentication#enable-authentication-globally
        // reflection
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        // console.log('BasicAuthGuard: isPublic 😡 ', isPublic)

        if (isPublic) {
            return true;
        }
        // console.log('BasicAuthGuard: isPublic 😡 ', isPublic)

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            // console.log('BasicAuthGuard: authHeader 😡 СУКААААА', authHeader)
            throw new DomainException(DomainExceptionCode.Unauthorized);
        }

        const base64Credentials = authHeader.split(' ')[1];
        // console.log('BasicAuthGuard: base64Credentials 😡 ', base64Credentials)

        const credentials = Buffer.from(base64Credentials, 'base64').toString(
            'utf-8',
        );
        // console.log('BasicAuthGuard: credentials 😡 ', credentials)

        const [username, password] = credentials.split(':');
        // console.log('BasicAuthGuard: username, password 😡 СУКААААА', username, password)
        let isAdmin

        if (username === this.validUsername && password === this.validPassword) {
            // console.log('BasicAuthGuard: username === this.validUsername && password === this.validPassword 😡 true')
            isAdmin = await this.usersRepository.findByAdminRepository('ADMIN');
            // console.log('BasicAuthGuard: isAdmin 😡 ', isAdmin)
            if (isAdmin) {
                request.user = isAdmin
                return true;
            }
            // else{
            //     return false;
            // }
            return true;
        } else {
            // console.log('BasicAuthGuard: authHeader 😡 СУКААААА', authHeader)
            throw new DomainException(DomainExceptionCode.Unauthorized);
        }
    }
}