import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment, CommentDocument, type CommentModelType } from '../comments-domain/comments.entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

@Injectable()
export class CommentsRepository {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType
    ) { }

    async findCommentByIdRepository(id: string): Promise<CommentDocument | null> {
        return this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async save(comment: CommentDocument) {
        await comment.save();
    }

    async findCommentOrNotFoundFailRepository(id: string): Promise<CommentDocument> {
        const comment = await this.findCommentByIdRepository(id);
        if (!comment) {
            throw new DomainException(INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND)
        }

        return comment;
    }
}