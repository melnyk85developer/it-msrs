import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShopBrand, ShopBrandSchema } from "./shop-brand-domain/shop-brand-entity";
import { ShopBrandRepository } from "./shop-brand-infrastructure/shop-brand.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: ShopBrand.name, schema: ShopBrandSchema }])],
    providers: [ShopBrandRepository],
    exports: [ShopBrandRepository],
})
export class ShopBrandRepositoryModule { }
