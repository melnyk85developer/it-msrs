import { Module } from '@nestjs/common';
import { UserAccountsModule } from '../user.accounts/user-accounts.module';
import { BlogsService } from './blogs/blogs-application/blogs.service';
import { BlogsController } from './blogs/blogs-api/blogs.controller';
import { BlogsRepository } from './blogs/blogs-infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/blogs-infrastructure/external-query-blogs/query-blogs/blogs.query-repository';
import { BlogsExternalQueryRepository } from './blogs/blogs-infrastructure/external-query-blogs/blogs.external-query-repository';
import { BlogsExternalService } from './blogs/blogs-application/blogs.external-service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/blogs-domian/blog.entity';
import { PostModule } from './posts/posts.module';
import { CommentModule } from './comments/comments.module';
import { PostsService } from './posts/posts-application/posts.service';
import { PostsQueryRepository } from './posts/posts-infrastructure/posts-external-query/posts-query/posts.query-repository';
import { BlogsRepositoryModule } from './blogs/blogs-repository.module';
import { CommentsRepositoryModule } from './comments/comments-repository.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
        UserAccountsModule,
        BlogsRepositoryModule,
        PostModule,
    ],
    controllers: [
        BlogsController
    ],
    providers: [
        BlogsService,
        BlogsQueryRepository,

        BlogsExternalQueryRepository,
        BlogsExternalService,
    ],
    exports: [
        BlogsQueryRepository,

        BlogsExternalQueryRepository,
        BlogsExternalService,
    ],
})
export class BloggersPlatformModule { }