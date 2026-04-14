import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { CreateMerchandiseTypeUseCase } from './merchandise-type-application/merchandise-type.use-cases/create-merchandise-type.use-case';
import { DeleteMerchandiseTypeUseCase } from './merchandise-type-application/merchandise-type.use-cases/delete-merchandise-type.use-case';
import { MerchandiseType, MerchandiseTypeSchema } from './merchandise-type-domain/merchandise-type-entity';
import { MerchandiseTypeController } from './merchandise-type-api/merchandise-type.controller';
import { UpdateMerchandiseTypeUseCase } from './merchandise-type-application/merchandise-type.use-cases/update-merchandise-type.use-case';
import { MerchandiseTypeQueryRepository } from './merchandise-type-infrastructure/merchandise-type.query-repository';
import { MerchandiseTypeRepository } from './merchandise-type-infrastructure/merchandise-type.repository';
import { MerchandiseTypeRepositoryModule } from './merchandise-type-repository.module';

const useCases = [
    CreateMerchandiseTypeUseCase,
    UpdateMerchandiseTypeUseCase,
    DeleteMerchandiseTypeUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: MerchandiseType.name, schema: MerchandiseTypeSchema }]),
        CqrsModule,
        UserAccountsModule,
        MerchandiseTypeRepositoryModule
    ],
    controllers: [
        MerchandiseTypeController
    ],
    providers: [
        ...useCases,
        MerchandiseTypeQueryRepository,
        MerchandiseTypeRepository
    ],
    exports: [
        ...useCases,
        MerchandiseTypeQueryRepository,
        MerchandiseTypeRepository
    ],
})
export class MerchandiseTypeModule { }
