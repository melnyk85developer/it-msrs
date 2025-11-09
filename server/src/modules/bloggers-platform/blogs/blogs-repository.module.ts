import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./blogs-domain/blog.entity";
import { BlogsRepository } from "./blogs-infrastructure/blogs.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
    providers: [BlogsRepository],
    exports: [BlogsRepository],
})
export class BlogsRepositoryModule { }
