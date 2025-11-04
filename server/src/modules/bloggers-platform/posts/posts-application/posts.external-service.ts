import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';;
import * as postsEntity from '../posts-domian/post.entity';
import { PostsRepository } from '../posts-infrastructure/posts.repository';

@Injectable()
export class PostsExternalService {
    constructor(
        //инжектирование модели в сервис через DI
        @InjectModel(postsEntity.Post.name)
        private PostModel: postsEntity.PostModelType,
        private postRepository: PostsRepository,
    ) { }

    async makeUserAsSpammer(postId: string) {
        const post = await this.postRepository.findPostOrNotFoundFail(postId);

        // post.makeSpammer();

        await this.postRepository.save(post);
    }
}