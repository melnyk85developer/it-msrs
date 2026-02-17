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

const useCases = [
    CreateLikeUseCase,
    UpdateLikeUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
        CqrsModule,
        PostModule,
        CommentModule,
        PhotoModule
    ],
    // controllers: [
    //     PostsController
    // ],
    providers: [
        ...useCases,
        LikesRepository,
        LikesQueryRepository
    ],
    exports: [
        LikesRepository,
        LikesQueryRepository
    ],
})
export class LikeModule { }