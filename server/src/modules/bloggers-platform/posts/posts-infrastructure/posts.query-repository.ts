import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { Post, PostDocument, type PostModelType } from '../posts-domain/post.entity';
import { GetPostsQueryParams } from '../posts-api/posts-input-dto/get-posts-query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(Post.name) private PostModel: PostModelType
    ) { }

    async getAllPostQueryRepository(filter: FilterQuery<Post>, normalizedQuery: GetPostsQueryParams): Promise<PostDocument[]> {
        // console.log('getAllPostRepository: 😡 filter', filter)
        const posts = await this.PostModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);
        // console.log('getAllPostRepository: 😡 posts res ', posts)
        return posts
    }

    async getPostByIdOrNotFoundFailQueryRepository(id: string): Promise<PostDocument> {
        // console.log('getPostByIdOrNotFoundFailQueryRepository: 😡 id', id)
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        });
        // console.log('getPostByIdOrNotFoundFailQueryRepository: 😡 post', post)
        if (!post) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_POST, 'post not found');
        }
        return post
    }
    async getPostsCountDocuments(filter: FilterQuery<Post>): Promise<number> {
        return await this.PostModel.countDocuments(filter);
    }
}