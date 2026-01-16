import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { SortDirection } from 'src/core/dto/base.query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PostForProfile, PostForProfileDocument, type PostForProfileModelType } from '../posts-domain/posts-for-profile-entity';
import { PostForProfileViewDto } from '../posts-for-profile-api/posts-for-profile-view-dto/posts-for-profile.view-dto';
import { PostForProfileMapper } from '../posts-for-profile-api/posts-for-profile-view-dto/post-for-profile.mapper';
import { GetPostForProfileQueryParams } from '../posts-for-profile-api/posts-for-profile-input-dto/get-posts-query-params.input-dto';

@Injectable()
export class PostsForProfileQueryRepository {
    constructor(
        @InjectModel(PostForProfile.name) private PostForProfileModel: PostForProfileModelType,
        private postForProfileMapper: PostForProfileMapper,
    ) { }

    async getAllPostsForProfileRepository(query: GetPostForProfileQueryParams, blogId?: string): Promise<PaginatedViewDto<PostForProfileViewDto[]>> {
        const normalizedQuery = GetPostForProfileQueryParams.normalize(query);

        const filter: FilterQuery<PostForProfile> = {
            deletedAt: null,
        };

        if (blogId) filter.blogId = blogId;

        if (normalizedQuery.searchTitleTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                title: { $regex: normalizedQuery.searchTitleTerm, $options: 'i' },
            });
        }
        if (normalizedQuery.searchContentTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                content: { $regex: normalizedQuery.searchContentTerm, $options: 'i' },
            });
        }
        const posts = await this.PostForProfileModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.PostForProfileModel.countDocuments(filter);

        // const items = posts.map(PostViewDto.mapToViewPosts);

        const items = await Promise.all(
            posts.map(post => this.postForProfileMapper.toExtendedView(post, null))
        );
        // console.log('getAllPostRepository: 😡 items', items)

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

    async getPostByIdOrNotFoundFailQueryRepository(id: string): Promise<PostForProfileViewDto> {
        const post = await this.PostForProfileModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!post) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_POST, 'post not found');
        }

        return await this.postForProfileMapper.toExtendedView(post as PostForProfileDocument, null)
    }
}