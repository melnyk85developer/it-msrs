import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Like, LikeSchema } from "./likes-domain/like.entity";
import { LikesRepository } from "./likes-infrastructure/likesRepository";

@Module({
    imports: [MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }])],
    providers: [LikesRepository],
    exports: [LikesRepository],
})
export class LikesRepositoryModule { }
