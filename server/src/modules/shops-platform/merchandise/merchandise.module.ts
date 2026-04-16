import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { CreateMerchandiseUseCase } from './merchandise-application/merchandise.use-cases/create-merchandise.use-case';
import { DeleteMerchandiseUseCase } from './merchandise-application/merchandise.use-cases/delete-merchandise.use-case';
import { Merchandise, MerchandiseSchema } from './merchandise-domain/merchandise.entity';
import { MerchandiseController } from './merchandise-api/merchandise.controller';
import { MerchandiseQueryRepository } from './merchandise-infrastructure/merchandise.query-repository';
import { MerchandiseRepository } from './merchandise-infrastructure/merchandise.repository';
import { UpdateMerchandiseUseCase } from './merchandise-application/merchandise.use-cases/update-merchandise.use-case';
import { MerchandiseRepositoryModule } from './merchandise-repository.module';
import { MerchandiseTypeModule } from '../merchandise-type/merchandise-type.module';
import { MerchandiseInfoModule } from '../merchandiseInfo/merchandise-info.module';
import { MerchandiseBrandModule } from '../merchandise-brand/merchandise-brand.module';

const useCases = [
    CreateMerchandiseUseCase,
    UpdateMerchandiseUseCase,
    DeleteMerchandiseUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Merchandise.name, schema: MerchandiseSchema }]),
        CqrsModule,
        UserAccountsModule,
        MerchandiseRepositoryModule,
        MerchandiseTypeModule,
        MerchandiseBrandModule,
        MerchandiseInfoModule,
    ],
    controllers: [
        MerchandiseController
    ],
    providers: [
        ...useCases,
        MerchandiseQueryRepository,
        MerchandiseRepository
    ],
    exports: [
        ...useCases,
        MerchandiseQueryRepository,
        MerchandiseRepository
    ],
})
export class MerchandiseModule { }
