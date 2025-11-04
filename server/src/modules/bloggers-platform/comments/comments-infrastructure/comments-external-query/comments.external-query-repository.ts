import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentExternalDto } from './comments-external-dto/comments.external-dto';
import { Comment, type CommentModelType } from '../../comments-domian/comments.entity';

@Injectable()
export class CommentsExternalQueryRepository {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType
    ) { }

    async getCommentByIdOrNotFoundFailExternalQueryRepository(id: string): Promise<CommentExternalDto> {
        const post = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!post) {
            throw new NotFoundException('comment not found');
        }

        return CommentExternalDto.mapToView(post);
    }
}