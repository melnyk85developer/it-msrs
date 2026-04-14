import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { Basket, BasketSchema } from './basket-domain/basket-entity';
import { CreateBasketUseCase } from './basket-application/basket.use-cases/create-basket.use-case';
import { DeleteBasketUseCase } from './basket-application/basket.use-cases/delete-basket.use-case';
import { BasketController } from './basket-api/basket.controller';
import { BasketRepositoryModule } from './basket-repository.module';
import { BasketQueryRepository } from './basket-infrastructure/basket.query-repository';
import { BasketRepository } from './basket-infrastructure/basket.repository';

const useCases = [
    CreateBasketUseCase,
    DeleteBasketUseCase,
    BasketRepositoryModule
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Basket.name, schema: BasketSchema }]),
        CqrsModule,
        UserAccountsModule,
    ],
    controllers: [
        BasketController
    ],
    providers: [
        ...useCases,
        BasketQueryRepository,
        BasketRepository
    ],
    exports: [
        ...useCases,
        BasketQueryRepository,
        BasketRepository
    ],
})
export class BasketModule { }
