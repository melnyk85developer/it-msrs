import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostDocument, type PostModelType } from '../posts-domain/post.entity';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

@Injectable()
export class PostsRepository {
    constructor(
        @InjectModel(Post.name) private PostModel: PostModelType
    ) { }

    async findById(id: string): Promise<PostDocument | null> {
        return this.PostModel.findOne({
            _id: new Types.ObjectId(id),
            deletedAt: null,
        });
    }

    async save(post: PostDocument) {
        await post.save();
    }

    async findPostOrNotFoundFail(id: string): Promise<PostDocument> {
        // console.log('PostsRepository: findPostOrNotFoundFail - id 😡 ', id)
        const post = await this.findById(id);
        if (!post) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_POST, 'post not found');
        }
        // console.log('PostsRepository: findPostOrNotFoundFail - post 😡 ', !!post)
        return post;
    }
}