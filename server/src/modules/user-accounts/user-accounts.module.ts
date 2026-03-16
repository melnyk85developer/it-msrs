import { Module } from '@nestjs/common';
import { UsersController } from './users-api/users.controller';
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthQueryRepository } from './users-infrastructure/auth.query-repository';
import { SessionModule } from '../user-sessions/sessions.module';
import { ConfirmationModule } from '../confirmationsCodes/confirmation-module';
import { IsBlockedEmailResendingService } from 'src/core/utils/blocked-utilite';
import { FilesService } from '../files/files.service';
// import { AdminService } from '../notifications/service/adminSrvice/adminSrvice';
import { UserRegistrationUseCase } from '../auth/auth-application/auth-use-cases/registration-use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UserLoginUseCase } from '../auth/auth-application/auth-use-cases/login-use-case';
import { RefreshTokenUseCase } from '../auth/auth-application/auth-use-cases/refresh-token.use-case.ts';
import { UserLogoutUseCase } from '../auth/auth-application/auth-use-cases/logout-use-case';
import { RegistrationEmailResendingUseCase } from '../auth/auth-application/auth-use-cases/registration-email-resending-use-case';
import { SendPasswordRecoveryEmailUseCase } from './users-application/user-use-cases/sendPasswordRecoveryEmailUseCase';
import { ConfirmationCodeRegistrationUseCase } from '../confirmationsCodes/confirmations-application/confirmation-use-cases/confirmation-code-registration-use-case';
import { UpdatePasswordUseCase } from './users-application/user-use-cases/updatePasswordUseCase';
import { CreateUserUseCase } from './users-application/user-use-cases/create-user.use-case';
import { UpdateUserUseCase } from './users-application/user-use-cases/update-user.use-case';
import { DeleteUserUseCase } from './users-application/user-use-cases/delete-user.use-case';
import { UpdateLastSeenUserUseCase } from './users-application/user-use-cases/update-last-seen-user.use-case';
import { PostQueryService } from '../bloggers-platform/posts/posts-application/post-query-service';
import { LikeModule } from '../likes/likes.module';

const useCases = [
    UserRegistrationUseCase,
    UserLoginUseCase,
    RefreshTokenUseCase,
    UserLogoutUseCase,
    RegistrationEmailResendingUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    UpdateLastSeenUserUseCase,
    SendPasswordRecoveryEmailUseCase,
    ConfirmationCodeRegistrationUseCase,
    UpdatePasswordUseCase
]

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
        CqrsModule,
        NotificationsModule,
        PassportModule,
        TokenModule,   // НУЖЕН для AuthService, стратегий, blacklist
        SessionModule, // СЕССИИ ИСПОЛЬЗУЮТСЯ ПРИ АВТОРИЗАЦИИ
        ConfirmationModule,
        // LikeModule
    ],
    controllers: [
        AuthController,
        // AdminController,
        UsersController
    ],
    providers: [
        ...useCases,
        UsersRepository,
        UsersQueryRepository,

        AuthService,
        // AdminService,
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
        UsersRepository,
        UsersQueryRepository,

        UsersExternalQueryRepository,
        UsersExternalService,

        JwtStrategy,
        AuthQueryRepository,
        FilesService,
        // AdminService
    ],
})
export class UserAccountsModule { }
