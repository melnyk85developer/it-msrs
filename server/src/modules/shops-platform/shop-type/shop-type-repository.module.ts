import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShopType, ShopTypeSchema } from "./shop-type-domain/shop-type-entity";
import { ShopTypeRepository } from "./shop-type-infrastructure/shop-type.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: ShopType.name, schema: ShopTypeSchema }])],
    providers: [ShopTypeRepository],
    exports: [ShopTypeRepository],
})
export class ShopTypeRepositoryModule { }
