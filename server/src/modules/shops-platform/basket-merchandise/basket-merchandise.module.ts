import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { CreateBasketMerchandiseUseCase } from './basketMerchandise-application/basket-merchandise.use-cases/create-basket-merchandise.use-case';
import { DeleteBasketMerchandiseUseCase } from './basketMerchandise-application/basket-merchandise.use-cases/delete-basket-merchandise.use-case';
import { BasketMerchandise, BasketMerchandiseSchema } from './basketMerchandise-domain/basket-merchandise-entity';
import { BasketMerchandiseController } from './basketMerchandise-api/basket-merchandise.controller';
import { BasketMerchandiseQueryRepository } from './basketMerchandise-infrastructure/basket-merchandise.query-repository';
import { BasketMerchandiseRepository } from './basketMerchandise-infrastructure/basket-merchandise.repository';
import { BasketMerchandiseRepositoryModule } from './basket-merchandise-repository.module';

const useCases = [
    CreateBasketMerchandiseUseCase,
    DeleteBasketMerchandiseUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: BasketMerchandise.name, schema: BasketMerchandiseSchema }]),
        CqrsModule,
        UserAccountsModule,
        BasketMerchandiseRepositoryModule
    ],
    controllers: [
        BasketMerchandiseController
    ],
    providers: [
        ...useCases,
        BasketMerchandiseQueryRepository,
        BasketMerchandiseRepository
    ],
    exports: [
        ...useCases,
        BasketMerchandiseQueryRepository,
        BasketMerchandiseRepository
    ],
})
export class BasketMerchandiseModule { }
