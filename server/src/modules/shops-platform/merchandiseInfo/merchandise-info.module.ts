import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { CreateMerchandiseInfoUseCase } from './merchandise-Info-application/merchandise-Info.use-cases/create-merchandise-Info.use-case';
import { DeleteMerchandiseInfoUseCase } from './merchandise-Info-application/merchandise-Info.use-cases/delete-merchandise-Info.use-case';
import { MerchandiseInfo, MerchandiseInfoSchema } from './merchandiseInfo-domain/merchandise-Info-entity';
import { MerchandiseInfoController } from './merchandise-Info-api/merchandise-Info.controller';
import { MerchandiseInfoRepositoryModule } from './merchandise-Info-repository.module';
import { MerchandiseInfoQueryRepository } from './merchandiseInfo-infrastructure/merchandise-Info.query-repository';
import { MerchandiseInfoRepository } from './merchandiseInfo-infrastructure/merchandise-Info.repository';

const useCases = [
    CreateMerchandiseInfoUseCase,
    DeleteMerchandiseInfoUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: MerchandiseInfo.name, schema: MerchandiseInfoSchema }]),
        CqrsModule,
        UserAccountsModule,
        MerchandiseInfoRepositoryModule
    ],
    controllers: [
        MerchandiseInfoController
    ],
    providers: [
        ...useCases,
        MerchandiseInfoQueryRepository,
        MerchandiseInfoRepository
    ],
    exports: [
        ...useCases,
        MerchandiseInfoQueryRepository,
        MerchandiseInfoRepository
    ],
})
export class MerchandiseInfoModule { }
