import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, type PostModelType } from '../../posts-domian/post.entity';
import { PostExternalDto } from './posts-external-dto/posts.external-dto';

@Injectable()
export class PostsExternalQueryRepository {
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType,
    ) { }

    async getPostByIdOrNotFoundFail(id: string): Promise<PostExternalDto> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!post) {
            throw new NotFoundException('post not found');
        }

        return PostExternalDto.mapToView(post);
    }
}