import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';;
import * as commentsEntity from '../comments-domian/comments.entity';
import { CommentsRepository } from '../comments-infrastructure/comments.repository';

@Injectable()
export class CommentsExternalService {
    constructor(
        //инжектирование модели в сервис через DI
        @InjectModel(commentsEntity.Comment.name)
        private CommentModel: commentsEntity.CommentModelType,
        private commentsRepository: CommentsRepository,
    ) { }

    async makeCommentAsSpammer(commentId: string) {
        const comment = await this.commentsRepository.findCommentOrNotFoundFailRepository(commentId);

        // comment.makeSpammer();

        await this.commentsRepository.save(comment);
    }
}