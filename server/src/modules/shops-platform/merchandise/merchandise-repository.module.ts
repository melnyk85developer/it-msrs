import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Merchandise, MerchandiseSchema } from './merchandise-domain/merchandise.entity';
import { MerchandiseRepository } from './merchandise-infrastructure/merchandise.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Merchandise.name, schema: MerchandiseSchema }])
    ],
    providers: [MerchandiseRepository],
    exports: [MerchandiseRepository],
})
export class MerchandiseRepositoryModule { }
