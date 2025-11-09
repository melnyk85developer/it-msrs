import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment, CommentDocument, type CommentModelType } from '../comments-domain/comments.entity';

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
            throw new NotFoundException('comment not found');
        }

        return comment;
    }
}