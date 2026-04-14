import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchandiseBrand, MerchandiseBrandSchema } from './merchandise-brand-domain/merchandise-brand.entity';
import { MerchandiseBrandRepository } from './merchandise-brand-infrastructure/merchandise-brand.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: MerchandiseBrand.name, schema: MerchandiseBrandSchema }])
    ],
    providers: [MerchandiseBrandRepository],
    exports: [MerchandiseBrandRepository],
})
export class MerchandiseBrandModule { }
