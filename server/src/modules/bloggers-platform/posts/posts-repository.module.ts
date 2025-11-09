import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsRepository } from "./posts-infrastructure/posts.repository";
import { Post, PostSchema } from "./posts-domain/post.entity";

@Module({
    imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
    providers: [PostsRepository],
    exports: [PostsRepository],
})
export class PostsRepositoryModule { }
