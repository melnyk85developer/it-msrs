import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Basket, BasketSchema } from './basket-domain/basket-entity';
import { BasketRepository } from './basket-infrastructure/basket.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Basket.name, schema: BasketSchema }])
    ],
    providers: [BasketRepository],
    exports: [BasketRepository],
})
export class BasketRepositoryModule { }
