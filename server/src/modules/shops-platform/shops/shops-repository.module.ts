import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MyShops, MyShopsSchema } from "./shops-domain/shops-entity";
import { MyShopsRepository } from "./shops-infrastructure/shops-repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: MyShops.name, schema: MyShopsSchema }])],
    providers: [MyShopsRepository],
    exports: [MyShopsRepository],
})
export class MyShopsRepositoryModule { }
