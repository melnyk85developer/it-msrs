import { Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "src/modules/user-accounts/users-infrastructure/users.query-repository";
import { Post, PostDocument } from "../posts-domain/post.entity";
import { PostExtendedViewDto } from "../posts-api/posts-view-dto/post-extended-view.dto";
import { PostViewDto } from "../posts-api/posts-view-dto/posts.view-dto";
import { LikesQueryRepository } from "src/modules/likes/likes-infrastructure/likesQueryRepository";
import { GetPostsQueryParams } from "../posts-api/posts-input-dto/get-posts-query-params.input-dto";
import { PaginatedViewDto } from "src/core/dto/base.paginated.viev-dto";
import { FilterQuery } from "mongoose";
import { PostsQueryRepository } from "../posts-infrastructure/posts.query-repository";
import { BlogsRepository } from "../../blogs/blogs-infrastructure/blogs.repository";

@Injectable()
export class PostQueryService {
    constructor(
        private readonly likesQueryRepository: LikesQueryRepository,
        private readonly usersQueryRepository: UsersQueryRepository,
        private readonly postsQueryRepository: PostsQueryRepository,
        private readonly blogsRepository: BlogsRepository,
    ) { }

    async getAllPostsQueryService(userId: string, query: GetPostsQueryParams, blogId?: string): Promise<PaginatedViewDto<PostViewDto[]>> {
        // console.log('getAllPostsQueryService - userId, blogId 😡😡😡 ', userId, blogId)
        blogId ? await this.blogsRepository.findBlogOrNotFoundFailRepository(blogId) : null
        const normalizedQuery = GetPostsQueryParams.normalize(query);

        const filter: FilterQuery<Post> = {
            deletedAt: null,
        };

        if (blogId) filter.blogId = blogId;

        if (normalizedQuery.searchTitleTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                title: { $regex: normalizedQuery.searchTitleTerm, $options: 'i' },
            });
        }
        if (normalizedQuery.searchShortDescriptionTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                shortDescription: { $regex: normalizedQuery.searchShortDescriptionTerm, $options: 'i' },
            });
        }
        if (normalizedQuery.searchShortContentTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                content: { $regex: normalizedQuery.searchShortContentTerm, $options: 'i' },
            });
        }
        if (normalizedQuery.searchShortBlogNameTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                blogName: { $regex: normalizedQuery.searchShortBlogNameTerm, $options: 'i' },
            });
        }
        // console.log('getAllPostsQueryService - filter, normalizedQuery 😡 ', filter, normalizedQuery)
        const posts = await this.postsQueryRepository.getAllPostQueryRepository(filter, normalizedQuery)

        const totalCount = await this.postsQueryRepository.getPostsCountDocuments(filter);

        // const items = posts.map(PostViewDto.mapToViewPosts);

        const items = await Promise.all(posts.map(post => this.postQueryMaperForLikes(post, userId)));

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

    async getPostQueryService(postId: string, userId: string | null): Promise<PostExtendedViewDto> {
        // console.log('PostQueryService: getPostQueryService - postId 😡 userId', postId, userId)
        const post = await this.postsQueryRepository.getPostByIdOrNotFoundFailQueryRepository(postId)
        return this.postQueryMaperForLikes(post, userId)
    }
    private async postQueryMaperForLikes(post: PostDocument, userId: string | null): Promise<PostExtendedViewDto> {
        // console.log('PostQueryService: postQueryMaperForLikes - post 😡 userId', post, userId)

        const base = PostViewDto.mapToViewPosts(post);
        let likesCount = 0
        let dislikesCount = 0
        let allLikes
        let isLike

        likesCount = await this.likesQueryRepository.getAllLikeForCommentRepository(String(post._id), 'post', 'Like');
        dislikesCount = await this.likesQueryRepository.getAllLikeForCommentRepository(String(post._id), 'post', 'Dislike');
        allLikes = await this.likesQueryRepository.getAllLikesCommentRepository(String(post._id), 'post');

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

        isLike = userId ? await this.likesQueryRepository.getLikeByIdRepository(String(post._id), 'post') : null;
        const myStatus = isLike && isLike.meta.userId === userId ? isLike.likeStatus : 'None';
        // console.log('PostQueryService: - 😡😡😡 isLike ', isLike)
        console.log('PostQueryService: - 😡 myStatus ', myStatus)
        return {
            ...base,
            extendedLikesInfo: {
                likesCount,
                dislikesCount,
                myStatus,
                newestLikes,
            },
        } as PostExtendedViewDto;
    }
}
