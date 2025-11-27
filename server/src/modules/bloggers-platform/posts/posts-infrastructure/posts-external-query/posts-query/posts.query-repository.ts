import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { Post, PostDocument, type PostModelType } from '../../../posts-domain/post.entity';
import { PostViewDto } from '../../../posts-api/posts-view-dto/posts.view-dto';
import { GetPostsQueryParams } from '../../../posts-api/posts-input-dto/get-posts-query-params.input-dto';
import { CreatePostDto } from '../../../posts-dto/create-post.dto';
import { PostMapper } from '../../../posts-api/posts-view-dto/post.mapper';
import { SortDirection } from 'src/core/dto/base.query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(Post.name) private PostModel: PostModelType,
        private postMapper: PostMapper,
    ) { }

    async getAllPostRepository(query: GetPostsQueryParams, blogId?: string): Promise<PaginatedViewDto<PostViewDto[]>> {
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
        const posts = await this.PostModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.PostModel.countDocuments(filter);

        // const items = posts.map(PostViewDto.mapToViewPosts);

        const items = await Promise.all(
            posts.map(post => this.postMapper.toExtendedView(post, null))
        );

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

    async getPostByIdOrNotFoundFailQueryRepository(id: string): Promise<PostViewDto> {

        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!post) {
            throw new DomainException(INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID, 'post not found');
        }

        return await this.postMapper.toExtendedView(post as PostDocument, null)
    }
}