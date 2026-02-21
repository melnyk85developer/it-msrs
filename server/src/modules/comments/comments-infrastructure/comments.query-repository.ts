import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { type CommentModelType, Comment, CommentDocument } from '../comments-domain/comments.entity';
import { GetCommentsQueryParams } from '../comments-api/comments-input-dto/get-comments-query-params.input-dto';
import { CommentViewDto } from '../comments-api/comments-view-dto/comments.view-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
    ) { }

    async getAllCommentsRepository(filter: FilterQuery<Comment>, normalizedQuery: GetCommentsQueryParams): Promise<CommentDocument[]> {
        // const normalizedQuery = GetCommentsQueryParams.normalize(query);
        return await this.CommentModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);
    }

    async getCommentByIdOrNotFoundFailRepository(id: string): Promise<CommentDocument> {
        // console.log('CommentsQueryRepository: getCommentByIdOrNotFoundFailRepository - id 😡 ', id)
        const post = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });
        // console.log('CommentsQueryRepository: getCommentByIdOrNotFoundFailRepository - post 😡 ', post)
        if (!post) {
            throw new DomainException(INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND)
        }
        // console.log('CommentsQueryRepository: getCommentByIdOrNotFoundFailRepository - post 😡 ', post)
        return post
    }
    async getCommentsCountDocuments(filter: FilterQuery<Comment>): Promise<number> {
        return await this.CommentModel.countDocuments(filter);
    }
}