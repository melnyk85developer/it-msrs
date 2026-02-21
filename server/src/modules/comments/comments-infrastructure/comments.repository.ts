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

    async findCommentByIdRepository(commentId: string): Promise<CommentDocument | null> {
        return this.CommentModel.findOne({
            _id: commentId,
            deletedAt: null,
        });
    }

    async save(comment: CommentDocument) {
        await comment.save();
    }

    async findCommentOrNotFoundFailRepository(commentId: string): Promise<CommentDocument> {
        // console.log('CommentsController: updateCommentController - commentId, dto 😡 ', commentId)
        let comment
        if (!commentId || commentId === undefined || commentId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            comment = await this.findCommentByIdRepository(commentId);
        }
        if (!comment) {
            throw new DomainException(INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND)
        }
        return comment;
    }
}