import { Injectable } from "@nestjs/common";
import { FilterQuery } from "mongoose";
import { UsersQueryRepository } from "src/modules/user-accounts/users-infrastructure/users.query-repository";
import { LikesQueryRepository } from "src/modules/likes/likes-infrastructure/likesQueryRepository";
import { PaginatedViewDto } from "src/core/dto/base.paginated.viev-dto";
import { CommentsQueryRepository } from "../comments-infrastructure/comments.query-repository";
import { GetCommentsQueryParams } from "../comments-api/comments-input-dto/get-comments-query-params.input-dto";
import { CommentViewDto } from "../comments-api/comments-view-dto/comments.view-dto";
import { CommentDocument } from "../comments-domain/comments.entity";
import { CommentExtendedViewDto } from "../comments-api/comments-view-dto/comment-extended-view.dto";
import { PostsRepository } from "src/modules/bloggers-platform/posts/posts-infrastructure/posts.repository";

@Injectable()
export class CommentQueryService {
    constructor(
        private readonly likesQueryRepository: LikesQueryRepository,
        private readonly usersQueryRepository: UsersQueryRepository,
        private readonly commentsQueryRepository: CommentsQueryRepository,
        private readonly postsRepository: PostsRepository,
    ) { }

    async getAllCommentsQueryService(userId: string, query: GetCommentsQueryParams, postId?: string): Promise<PaginatedViewDto<CommentViewDto[]>> {
        postId ? await this.postsRepository.findPostOrNotFoundFail(postId) : null
        const normalizedQuery = GetCommentsQueryParams.normalize(query);

        const filter: FilterQuery<Comment> = {
            deletedAt: null,
        };

        if (postId) filter.postId = postId;

        if (normalizedQuery.searchContentTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                content: { $regex: normalizedQuery.searchContentTerm, $options: 'i' },
            });
        }

        const comments = await this.commentsQueryRepository.getAllCommentsRepository(filter, normalizedQuery)

        const totalCount = await this.commentsQueryRepository.getCommentsCountDocuments(filter);

        // const items = comments.map(PostViewDto.mapToViewPosts);

        const items = await Promise.all(comments.map(comment => this.commentQueryMaperForLikes(comment, userId)));

        // console.log('getAllPostRepository: 😡 items.reverse()', items.reverse())
        // console.log('getAllPostRepository: 😡 items', items.filter(p => p.createdAt).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))

        return PaginatedViewDto.mapToView({
            // items: items.filter(p => p).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }

    async getCommentQueryService(commentId: string, userId: string | null): Promise<CommentExtendedViewDto> {
        // console.log('CommentQueryService: getCommentQueryService - commentId 😡 userId', commentId, userId)
        const comment = await this.commentsQueryRepository.getCommentByIdOrNotFoundFailRepository(commentId)
        // console.log('CommentQueryService: getCommentQueryService - comment 😡 ', comment)
        return this.commentQueryMaperForLikes(comment, userId)
    }
    private async commentQueryMaperForLikes(comment: CommentDocument, userId: string | null): Promise<CommentExtendedViewDto> {
        // console.log('CommentQueryService: postQueryMaperForLikes - post 😡 userId', post, userId)

        const base = CommentViewDto.mapToView(comment);
        let likesCount = 0
        let dislikesCount = 0
        let allLikes
        let isLike

        likesCount = await this.likesQueryRepository.getAllLikeForCommentRepository(String(comment._id), 'comment', 'Like');
        dislikesCount = await this.likesQueryRepository.getAllLikeForCommentRepository(String(comment._id), 'comment', 'Dislike');
        allLikes = await this.likesQueryRepository.getAllLikesCommentRepository(String(comment._id), 'comment');

        let newestLikes = [];
        if (allLikes?.length) {
            const latest = allLikes
                .filter(l => l.likeStatus === 'Like')
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 3);
            // @ts-ignore
            newestLikes = await Promise.all(latest.map(async like => {
                const user = await this.usersQueryRepository.getUserByIdOrNotFoundFail(String(like.meta.userId));
                return {
                    addedAt: like.updatedAt,
                    userId: like.meta.userId,
                    login: user?.login ?? 'Unknown',
                };
            }));
        }

        isLike = userId ? await this.likesQueryRepository.getLikeByIdRepository(String(comment._id), 'comment') : null;
        const myStatus = isLike && isLike.meta.userId === userId ? isLike.likeStatus : 'None';
        // console.log('CommentQueryService: - 😡 myStatus ', myStatus)
        return {
            ...base,
            likesInfo: {
                likesCount,
                dislikesCount,
                myStatus
            },
        } as CommentExtendedViewDto;
    }
}
