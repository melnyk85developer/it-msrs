import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopTypeController } from './shop-type-api/shop-type.controller';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { ShopTypeRepositoryModule } from './shop-type-repository.module';
import { ShopTypeQueryRepository } from './shop-type-infrastructure/shop-type.query-repository';
import { CreateShopTypeUseCase } from './shop-type-application/shop-type.use-cases/create-shop-type.use-case';
import { UpdateShopTypeUseCase } from './shop-type-application/shop-type.use-cases/update-shop-type.use-case';
import { DeleteShopTypeUseCase } from './shop-type-application/shop-type.use-cases/delete-shop-type.use-case';
import { ShopType, ShopTypeSchema } from './shop-type-domain/shop-type-entity';
import { ShopTypeRepository } from './shop-type-infrastructure/shop-type.repository';
import { BasketRepositoryModule } from '../basket/basket-repository.module';

const useCases = [
    CreateShopTypeUseCase,
    UpdateShopTypeUseCase,
    DeleteShopTypeUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ShopType.name, schema: ShopTypeSchema }]),
        CqrsModule,
        UserAccountsModule,
        ShopTypeRepositoryModule
    ],
    controllers: [
        ShopTypeController
    ],
    providers: [
        ...useCases,
        ShopTypeRepository,
        ShopTypeQueryRepository,
    ],
    exports: [
        ShopTypeRepository,
        ShopTypeQueryRepository,
    ],
})
export class ShopTypeModule { }
