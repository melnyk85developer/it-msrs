import { Module } from '@nestjs/common';
import { UsersController } from './users-api/users.controller';
import { UsersService } from './users-application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './users-infrastructure/users.repository';
import { AuthController } from '../auth/auth-api/auth.controller';
import { UsersExternalQueryRepository } from './users-infrastructure/users.external-query-repository';
import { UsersExternalService } from './users-application/users.external-service';
import { User, UserSchema } from './users-domain/user.entity';
import { UsersQueryRepository } from './users-infrastructure/users.query-repository';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthService } from '../auth/auth-application/auth.service';
import { LocalStrategy } from './users-guards/local/local.strategy';
import { CryptoService } from './users-application/crypto.service';
import { JwtStrategy } from './users-guards/bearer/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenModule } from '../tokens/token.module';
import { SessionService } from '../usersSessions/sessions-application/sessions.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionController } from '../usersSessions/sessions-api/sessions.controller';
import { AuthQueryRepository } from './users-infrastructure/auth.query-repository';
import { SessionQueryRepository } from '../usersSessions/sessions-infrastructure/sessions.query-repository';
import { SessionModule } from '../usersSessions/sessions.module';
import { ConfirmationModule } from '../confirmationsCodes/confirmation-module';
import { IsBlockedEmailResendingService } from 'src/core/utils/blocked-utilite';
import { FilesService } from '../files/files.service';
import { AdminController } from './users-api/admin.controller';
import { AdminService } from '../notifications/service/adminSrvice/adminSrvice';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_ACCESS_SECRET'),
            }),
            inject: [ConfigService],
        }),

        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ]),

        NotificationsModule,
        PassportModule,

        TokenModule,   // НУЖЕН для AuthService, стратегий, blacklist
        SessionModule, // СЕССИИ ИСПОЛЬЗУЮТСЯ ПРИ АВТОРИЗАЦИИ
        ConfirmationModule
    ],
    controllers: [
        AuthController,
        AdminController,
        UsersController,
    ],
    providers: [
        UsersService,
        UsersRepository,
        UsersQueryRepository,

        AuthService,
        AdminService,
        AuthQueryRepository,

        LocalStrategy,
        JwtStrategy,

        CryptoService,
        IsBlockedEmailResendingService,

        UsersExternalQueryRepository,
        UsersExternalService,
        FilesService
    ],
    exports: [
        UsersService,
        UsersRepository,
        UsersQueryRepository,

        UsersExternalQueryRepository,
        UsersExternalService,

        JwtStrategy,
        AuthQueryRepository,
        FilesService,
        AdminService
    ],
})
export class UserAccountsModule { }
