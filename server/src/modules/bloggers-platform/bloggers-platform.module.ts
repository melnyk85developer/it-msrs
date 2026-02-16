import { Module } from '@nestjs/common';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BlogsController } from './blogs/blogs-api/blogs.controller';
import { BlogsQueryRepository } from './blogs/blogs-infrastructure/external-query-blogs/query-blogs/blogs.query-repository';
import { BlogsExternalQueryRepository } from './blogs/blogs-infrastructure/external-query-blogs/blogs.external-query-repository';
import { BlogsExternalService } from './blogs/blogs-application/blogs.external-service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/blogs-domain/blog.entity';
import { PostModule } from './posts/posts.module';
import { BlogsRepositoryModule } from './blogs/blogs-repository.module';
import { CreateBlogUseCase } from './blogs/blogs-application/blogs.use-cases/create-blog.use-case';
import { UpdateBlogUseCase } from './blogs/blogs-application/blogs.use-cases/update-blog.use-case';
import { DeleteBlogUseCase } from './blogs/blogs-application/blogs.use-cases/delete-blog.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateBlogHomePageUseCase } from './blogs/blogs-application/blogs.use-cases/update-blog-home-page.use-case';

const useCases = [
    CreateBlogUseCase,
    UpdateBlogUseCase,
    UpdateBlogHomePageUseCase,
    DeleteBlogUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
        CqrsModule,
        UserAccountsModule,
        BlogsRepositoryModule,
        PostModule,
    ],
    controllers: [
        BlogsController
    ],
    providers: [
        ...useCases,
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