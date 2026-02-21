import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comments-domain/comments.entity';
import { CommentsController } from './comments-api/comments.controller';
import { CommentsQueryRepository } from './comments-infrastructure/comments.query-repository';
import { CommentsExternalQueryRepository } from './comments-infrastructure/comments-external-query/comments.external-query-repository';
import { CommentsExternalService } from './comments-application/comments.external-service';
import { CommentsRepositoryModule } from './comments-repository.module';
import { PostsRepositoryModule } from '../bloggers-platform/posts/posts-repository.module';
import { CreateCommentUseCase } from './comments-application/comments.use-cases/create-comment.use-case';
import { UpdateCommentUseCase } from './comments-application/comments.use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './comments-application/comments.use-cases/delete-comment.use-case';
import { CommentsRepository } from './comments-infrastructure/comments.repository';
import { CommentQueryService } from './comments-application/comments-query-service';
import { LikesRepositoryModule } from '../likes/likes-repository.module';
import { LikeModule } from '../likes/likes.module';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';

const useCases = [
    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        CqrsModule,
        UserAccountsModule,
        CommentsRepositoryModule,
        PostsRepositoryModule,
        LikesRepositoryModule,
        LikeModule
    ],
    controllers: [
        CommentsController,
    ],
    providers: [
        ...useCases,
        CommentQueryService,

        CommentsRepository,
        CommentsQueryRepository,

        CommentsExternalQueryRepository,
        CommentsExternalService,
    ],
    exports: [
        CommentQueryService,

        CommentsRepository,
        CommentsQueryRepository,

        CommentsExternalQueryRepository,
        CommentsExternalService
    ],
})
export class CommentModule { }