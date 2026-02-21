import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts-api/posts.controller';
import { PostsQueryRepository } from './posts-infrastructure/posts.query-repository';
import { PostsExternalQueryRepository } from './posts-infrastructure/posts-external-query/posts.external-query-repository';
import { PostsExternalService } from './posts-application/posts.external-service';
import { Post, PostSchema } from './posts-domain/post.entity';
import { CommentModule } from '../../comments/comments.module';
import { BlogsRepositoryModule } from '../blogs/blogs-repository.module';
import { PostsRepositoryModule } from './posts-repository.module';
import { PostQueryService } from './posts-application/post-query-service';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { CreatePostUseCase } from './posts-application/posts.use-cases/create-post.use-case';
import { DeletePostUseCase } from './posts-application/posts.use-cases/delete-post.use-case';
import { UpdatePostUseCase } from './posts-application/posts.use-cases/update-post.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostOneBlogUseCase } from './posts-application/posts.use-cases/create-post-one-blog.use-case';
import { PostsRepository } from './posts-infrastructure/posts.repository';
import { LikesQueryRepository } from 'src/modules/likes/likes-infrastructure/likesQueryRepository';
import { LikeModule } from 'src/modules/likes/likes.module';
import { LikesRepository } from 'src/modules/likes/likes-infrastructure/likesRepository';
import { LikesRepositoryModule } from 'src/modules/likes/likes-repository.module';
import { CommentQueryService } from 'src/modules/comments/comments-application/comments-query-service';

const useCases = [
    CreatePostUseCase,
    CreatePostOneBlogUseCase,
    UpdatePostUseCase,
    DeletePostUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        CqrsModule,
        CommentModule,
        UserAccountsModule,
        PostsRepositoryModule,
        BlogsRepositoryModule,
        LikesRepositoryModule,
        LikeModule
    ],
    controllers: [
        PostsController
    ],
    providers: [
        ...useCases,
        PostsRepository,
        PostsQueryRepository,

        PostQueryService,
        CommentQueryService,
        // LikesRepository,
        // LikesQueryRepository,

        PostsExternalQueryRepository,
        PostsExternalService,

    ],
    exports: [
        PostsQueryRepository,
        PostsRepository,

        PostQueryService,
        CommentQueryService,
        // LikesRepository,
        // LikesQueryRepository,

        PostsExternalQueryRepository,
        PostsExternalService,

    ],
})
export class PostModule { }