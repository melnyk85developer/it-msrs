import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { MerchandiseBrandController } from './merchandise-brand-api/merchandise-brand.controller';
import { CreateMerchandiseBrandUseCase } from './merchandise-brand-application/merchandise-brand-use-cases/create-merchandise-brand.use-case';
import { DeleteMerchandiseBrandUseCase } from './merchandise-brand-application/merchandise-brand-use-cases/delete-merchandise-brand.use-case';
import { MerchandiseBrand, MerchandiseBrandSchema } from './merchandise-brand-domain/merchandise-brand.entity';
import { MerchandiseBrandQueryRepository } from './merchandise-brand-infrastructure/merchandise-brand.query-repository';
import { MerchandiseBrandRepository } from './merchandise-brand-infrastructure/merchandise-brand.repository';
import { UpdateMerchandiseBrandUseCase } from './merchandise-brand-application/merchandise-brand-use-cases/update-merchandise-brand.use-case';

const useCases = [
    CreateMerchandiseBrandUseCase,
    UpdateMerchandiseBrandUseCase,
    DeleteMerchandiseBrandUseCase,
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: MerchandiseBrand.name, schema: MerchandiseBrandSchema }]),
        CqrsModule,
        UserAccountsModule,
    ],
    controllers: [
        MerchandiseBrandController
    ],
    providers: [
        ...useCases,
        MerchandiseBrandQueryRepository,
        MerchandiseBrandRepository
    ],
    exports: [
        ...useCases,
        MerchandiseBrandQueryRepository,
        MerchandiseBrandRepository
    ],
})
export class MerchandiseBrandModule { }
