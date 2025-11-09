import { Module } from '@nestjs/common';
import { UsersController } from './users-api/users.controller';
import { UsersService } from './users-application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './users-infrastructure/users.repository';
import { AuthController } from './users-api/auth.controller';
import { SecurityDevicesController } from './users-api/security-devices.controller';
import { UsersExternalQueryRepository } from './users-infrastructure/users-external-query/users.external-query-repository';
import { UsersExternalService } from './users-application/users.external-service';
import { User, UserSchema } from './users-domain/user.entity';
import { UsersQueryRepository } from './users-infrastructure/users-external-query/users-query-repository/users.query-repository';
import { SecurityDevicesQueryRepository } from './users-infrastructure/users-external-query/users-query-repository/security-devices.query-repository';
import { AuthQueryRepository } from './users-infrastructure/users-external-query/users-query-repository/auth.query-repository';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthService } from './users-application/auth.service';
import { LocalStrategy } from './users-guards/local/local.strategy';
import { CryptoService } from './users-application/crypto.service';
import { JwtStrategy } from './users-guards/bearer/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        //если в системе несколько токенов (например, access и refresh) с разными опциями (время жизни, секрет)
        //можно переопределить опции при вызове метода jwt.service.sign
        //или написать свой tokens сервис (адаптер), где эти опции будут уже учтены
        //или использовать useFactory и регистрацию через токены для JwtService,
        //для создания нескольких экземпляров в IoC с разными настройками (пример в следующих занятиях)
        JwtModule.register({
            secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
            signOptions: { expiresIn: '60m' }, // Время жизни токена
        }),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ]),
        NotificationsModule,
    ],
    controllers: [
        UsersController,
        AuthController,
        SecurityDevicesController
    ],
    providers: [
        UsersService,
        UsersRepository,
        UsersQueryRepository,
        SecurityDevicesQueryRepository,
        AuthQueryRepository,

        AuthService,
        LocalStrategy,
        CryptoService,
        JwtStrategy,

        UsersExternalQueryRepository,
        UsersExternalService,
    ],
    exports: [
        JwtStrategy, 
        UsersExternalQueryRepository, 
        UsersExternalService,

        UsersQueryRepository
    ]
})
export class UserAccountsModule { }