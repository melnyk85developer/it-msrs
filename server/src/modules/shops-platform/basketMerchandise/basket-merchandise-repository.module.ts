import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BasketMerchandise, BasketMerchandiseSchema } from './basketMerchandise-domain/basket-merchandise-entity';
import { BasketMerchandiseRepository } from './basketMerchandise-infrastructure/basket-merchandise.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: BasketMerchandise.name, schema: BasketMerchandiseSchema }])
    ],
    providers: [BasketMerchandiseRepository],
    exports: [BasketMerchandiseRepository],
})
export class BasketMerchandiseRepositoryModule { }
