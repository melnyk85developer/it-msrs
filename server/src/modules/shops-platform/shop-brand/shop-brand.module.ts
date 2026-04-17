import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopBrandController } from './shop-brand-api/shop-brand.controller';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { ShopBrandRepositoryModule } from './shop-brand-repository.module';
import { ShopBrandQueryRepository } from './shop-brand-infrastructure/shop-brand.query-repository';
import { CreateShopBrandUseCase } from './shop-brand-application/shop-brand.use-cases/create-shop-brand.use-case';
import { UpdateShopBrandUseCase } from './shop-brand-application/shop-brand.use-cases/update-shop-brand.use-case';
import { DeleteShopBrandUseCase } from './shop-brand-application/shop-brand.use-cases/delete-shop-brand.use-case';
import { ShopBrand, ShopBrandSchema } from './shop-brand-domain/shop-brand-entity';
import { ShopBrandRepository } from './shop-brand-infrastructure/shop-brand.repository';
import { BasketRepositoryModule } from '../basket/basket-repository.module';

const useCases = [
    CreateShopBrandUseCase,
    UpdateShopBrandUseCase,
    DeleteShopBrandUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ShopBrand.name, schema: ShopBrandSchema }]),
        CqrsModule,
        UserAccountsModule,
        ShopBrandRepositoryModule
    ],
    controllers: [
        ShopBrandController
    ],
    providers: [
        ...useCases,
        ShopBrandRepository,
        ShopBrandQueryRepository,
    ],
    exports: [
        ShopBrandRepository,
        ShopBrandQueryRepository,
    ],
})
export class ShopBrandModule { }
