import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostDocument, type PostModelType } from '../posts-domian/post.entity';
import { Types } from 'mongoose';

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
            throw new NotFoundException('post not found');
        }
        // console.log('PostsRepository: findPostOrNotFoundFail - post 😡 ', !!post)
        return post;
    }
}