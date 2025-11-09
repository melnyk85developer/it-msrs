import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts-api/posts.controller';
import { PostsService } from './posts-application/posts.service';
import { PostsQueryRepository } from './posts-infrastructure/posts-external-query/posts-query/posts.query-repository';
import { PostsExternalQueryRepository } from './posts-infrastructure/posts-external-query/posts.external-query-repository';
import { PostsExternalService } from './posts-application/posts.external-service';
import { Post, PostSchema } from './posts-domain/post.entity';
import { CommentModule } from '../comments/comments.module';
import { ValidationUpdatePostInterceptor } from './posts-interceptors/post-update-validation-interceptor';
import { BlogsRepositoryModule } from '../blogs/blogs-repository.module';
import { PostsRepositoryModule } from './posts-repository.module';
import { PostMapper } from './posts-api/posts-view-dto/post.mapper';
import { UserAccountsModule } from 'src/modules/user.accounts/user-accounts.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        CommentModule,
        UserAccountsModule,
        PostsRepositoryModule,
        BlogsRepositoryModule
    ],
    controllers: [
        PostsController
    ],
    providers: [
        PostsService,
        PostsQueryRepository,
        PostMapper,

        PostsExternalQueryRepository,
        PostsExternalService,
        
        ValidationUpdatePostInterceptor
    ],
    exports: [
        PostsService,
        PostsQueryRepository,
        PostMapper,

        PostsExternalQueryRepository,
        PostsExternalService
    ],
})
export class PostModule { }