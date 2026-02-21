import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Like, LikeSchema } from './likes-domain/like.entity';
import { CreateLikeUseCase } from './likes-application/likes.use-cases/create-like.use-case';
import { LikesQueryRepository } from './likes-infrastructure/likesQueryRepository';
import { LikesRepository } from './likes-infrastructure/likesRepository';
import { UpdateLikeUseCase } from './likes-application/likes.use-cases/update-like.use-case';
import { PostModule } from '../bloggers-platform/posts/posts.module';
import { CommentModule } from '../comments/comments.module';
import { PhotoModule } from '../gallery/photos/photos.module';
import { PostQueryService } from '../bloggers-platform/posts/posts-application/post-query-service';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { PostsRepository } from '../bloggers-platform/posts/posts-infrastructure/posts.repository';
import { CommentsRepository } from '../comments/comments-infrastructure/comments.repository';
import { PhotoRepository } from '../gallery/photos/photos-infrastructure/photos-repository';
import { UsersQueryRepository } from '../user-accounts/users-infrastructure/users.query-repository';
import { PostsRepositoryModule } from '../bloggers-platform/posts/posts-repository.module';
import { BlogsRepositoryModule } from '../bloggers-platform/blogs/blogs-repository.module';
import { LikesRepositoryModule } from './likes-repository.module';
import { CommentsRepositoryModule } from '../comments/comments-repository.module';
import { PhotoRepositoryModule } from '../gallery/photos/photos-repository.module';

const useCases = [
    CreateLikeUseCase,
    UpdateLikeUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
        // PostModule,

        CqrsModule,
        PostsRepositoryModule,
        BlogsRepositoryModule,
        LikesRepositoryModule,
        CommentsRepositoryModule,
        PhotoRepositoryModule
        // UserAccountsModule,
        // CommentModule,
        // PhotoModule
    ],
    providers: [
        ...useCases,
        LikesRepository,
        LikesQueryRepository,
        
        // UsersQueryRepository,
        // PostQueryService,
        // PostsRepository,
        // CommentsRepository,
        // PhotoRepository,

    ],
    exports: [
        LikesRepository,
        LikesQueryRepository,

        // UsersQueryRepository,
        // PostQueryService,
        // PostsRepository,
        // CommentsRepository,
        // PhotoRepository,
        // MongooseModule, // 🔥 важно
    ],
})
export class LikeModule { }