import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { type CommentModelType, Comment } from '../../../comments-domain/comments.entity';
import { GetCommentsQueryParams } from '../../../comments-api/comments-input-dto/get-comments-query-params.input-dto';
import { CommentViewDto } from '../../../comments-api/comments-view-dto/comments.view-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
    ) { }

    async getAllCommentsRepository(query: GetCommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const normalizedQuery = GetCommentsQueryParams.normalize(query);

        const filter: FilterQuery<Comment> = {
            deletedAt: null,
        };

        if (normalizedQuery.searchContentTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                content: { $regex: normalizedQuery.searchContentTerm, $options: 'i' },
            });
        }

        const posts = await this.CommentModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.CommentModel.countDocuments(filter);

        const items = posts.map(CommentViewDto.mapToView);

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }

    async getCommentByIdOrNotFoundFailRepository(id: string): Promise<CommentViewDto> {
        const post = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!post) {
            throw new DomainException(INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND)
        }

        return CommentViewDto.mapToView(post);
    }
}