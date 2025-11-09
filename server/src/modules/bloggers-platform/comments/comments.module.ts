import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comments-domain/comments.entity';
import { CommentsController } from './comments-api/comments.controller';
import { CommentsService } from './comments-application/comments.service';
import { CommentsRepository } from './comments-infrastructure/comments.repository';
import { CommentsQueryRepository } from './comments-infrastructure/comments-external-query/comments-query/comments.query-repository';
import { CommentsExternalQueryRepository } from './comments-infrastructure/comments-external-query/comments.external-query-repository';
import { CommentsExternalService } from './comments-application/comments.external-service';
import { PostModule } from '../posts/posts.module';
import { CommentsRepositoryModule } from './comments-repository.module';
import { ValidationUpdateCommentInterceptor } from './comments-interceptors/comment-update-validation-interceptor';
import { PostsRepositoryModule } from '../posts/posts-repository.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        CommentsRepositoryModule,
        PostsRepositoryModule
    ],
    controllers: [
        CommentsController,
    ],
    providers: [
        CommentsService,
        CommentsQueryRepository,

        CommentsExternalQueryRepository,
        CommentsExternalService,
        ValidationUpdateCommentInterceptor
    ],
    exports: [
        CommentsService,
        CommentsQueryRepository,

        CommentsExternalQueryRepository,
        CommentsExternalService
    ],
})
export class CommentModule { }