import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchandiseInfoRepository } from './merchandiseInfo-infrastructure/merchandise-Info.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { MerchandiseInfo, MerchandiseInfoSchema } from './merchandiseInfo-domain/merchandise-Info-entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: MerchandiseInfo.name, schema: MerchandiseInfoSchema }])
    ],
    providers: [MerchandiseInfoRepository],
    exports: [MerchandiseInfoRepository],
})
export class MerchandiseInfoRepositoryModule { }
