import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { MyShopsController } from './shops/shops-api/shops.controller';
import { MyShopsRepositoryModule } from './shops/shops-repository.module';
import { CreateMyShopsUseCase } from './shops/shops-application/shops-use-cases/create-shops.use-case';
import { UpdateMyShopsUseCase } from './shops/shops-application/shops-use-cases/update-shops.use-case';
import { DeleteMyShopsUseCase } from './shops/shops-application/shops-use-cases/delete-shops.use-case';
import { MyShopsRepository } from './shops/shops-infrastructure/shops-repository';
import { MyShopsQueryRepository } from './shops/shops-infrastructure/shops.query-repository';
import { MyShops, MyShopsSchema } from './shops/shops-domain/shops-entity';
import { ShopTypeModule } from './shop-type/shop-type.module';
import { MerchandiseInfoModule } from './merchandiseInfo/merchandise-info.module';
import { MerchandiseTypeModule } from './merchandise-type/merchandise-type.module';
import { MerchandiseModule } from './merchandise/merchandise.module';
import { MerchandiseBrandModule } from './merchandise-brand/merchandise-brand.module';
import { BasketModule } from './basket/basket.module';
import { BasketMerchandiseModule } from './basket-merchandise/basket-merchandise.module';
import { ShopBrandModule } from './shop-brand/shop-brand.module';

const useCases = [
    CreateMyShopsUseCase,
    UpdateMyShopsUseCase,
    DeleteMyShopsUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: MyShops.name, schema: MyShopsSchema }]),
        CqrsModule,
        UserAccountsModule,
        MyShopsRepositoryModule,
        ShopTypeModule,
        ShopBrandModule,
        MerchandiseInfoModule,
        MerchandiseTypeModule,
        MerchandiseBrandModule,
        MerchandiseModule,
        BasketModule,
        BasketMerchandiseModule
    ],
    controllers: [
        MyShopsController
    ],
    providers: [
        ...useCases,
        MyShopsRepository,
        MyShopsQueryRepository,
    ],
    exports: [
        MyShopsRepository,
        MyShopsQueryRepository,
    ],
})
export class ShopsPlatformModule { }
