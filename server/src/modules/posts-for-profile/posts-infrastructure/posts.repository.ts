import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PostForProfile, PostForProfileDocument, type PostForProfileModelType } from '../posts-domain/posts-for-profile-entity';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';

@Injectable()
export class PostForProfileRepository {
    constructor(
        @InjectModel(PostForProfile.name) private PostForProfileModel: PostForProfileModelType
    ) { }

    async save(post: PostForProfileDocument) {
        await post.save();
    }

    async findPostForProfileById(id: string): Promise<PostForProfileDocument | null> {
        return this.PostForProfileModel.findOne({
            _id: new Types.ObjectId(id),
            deletedAt: null,
        });
    }

    async findPostForProfileByIdOrNotFoundFailRepository(id: string): Promise<PostForProfileDocument> {
        let post
        if (!id || id === undefined || id === 'undefined') {
            // console.log('PostForProfileRepository: findPostForProfileOrNotFoundFailRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PostForProfileRepository: findPostForProfileOrNotFoundFailRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            post = await this.findPostForProfileById(id);
        }
        if (!post) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_POST);
        }
        return post;
    }

    async deletePostForProfile(post: string): Promise<any> {
        return this.PostForProfileModel.deleteOne({
            post: post,
        });
    }
}