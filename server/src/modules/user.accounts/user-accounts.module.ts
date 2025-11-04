import { Module } from '@nestjs/common';
import { UsersController } from './users-api/users.controller';
import { UsersService } from './users-application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './users-infrastructure/users.repository';
import { AuthController } from './users-api/auth.controller';
import { SecurityDevicesController } from './users-api/security-devices.controller';
import { UsersExternalQueryRepository } from './users-infrastructure/users-external-query/users.external-query-repository';
import { UsersExternalService } from './users-application/users.external-service';
import { User, UserSchema } from './users-domian/user.entity';
import { UsersQueryRepository } from './users-infrastructure/users-external-query/users-query-repository/users.query-repository';
import { SecurityDevicesQueryRepository } from './users-infrastructure/users-external-query/users-query-repository/security-devices.query-repository';
import { AuthQueryRepository } from './users-infrastructure/users-external-query/users-query-repository/auth.query-repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ]),
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
        UsersExternalQueryRepository,
        UsersExternalService,
    ],
    exports: [
        UsersService,
        UsersRepository,
        UsersQueryRepository,
        SecurityDevicesQueryRepository,
        AuthQueryRepository,
        UsersExternalQueryRepository,
        UsersExternalService,
    ],
})
export class UserAccountsModule { }