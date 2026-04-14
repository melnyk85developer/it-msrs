import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { MerchandiseType, MerchandiseTypeSchema } from './merchandise-type-domain/merchandise-type-entity';
import { MerchandiseTypeRepository } from './merchandise-type-infrastructure/merchandise-type.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: MerchandiseType.name, schema: MerchandiseTypeSchema }])
    ],
    providers: [MerchandiseTypeRepository],
    exports: [MerchandiseTypeRepository],
})
export class MerchandiseTypeRepositoryModule { }
