import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentsRepository } from "./comments-infrastructure/comments.repository";
import { Comment, CommentSchema } from "./comments-domian/comments.entity";

@Module({
    imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
    providers: [CommentsRepository],
    exports: [CommentsRepository],
})
export class CommentsRepositoryModule { }
