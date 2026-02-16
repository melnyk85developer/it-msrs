import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Like, LikeDocument, type LikeModelType } from "../likes-domain/like.entity";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";

@Injectable()
export class LikesRepository {
    constructor(
        @InjectModel(Like.name) private LikeModel: LikeModelType,
    ) { }

    async save(like: LikeDocument) {
        await like.save();
    }
    async findLikeByIdRepository(entity: string, entityId: string): Promise<LikeDocument | null> {
        return this.LikeModel.findOne(
            {
                'meta.entityType': entity,
                'meta.entityId': entityId,
                deletedAt: null
            },
        );
    }

    async findlikeOrNotFoundFailRepository(entity: string, entityId: string): Promise<LikeDocument> {
        console.log('CommentsController: updateCommentController - entityId, dto 😡 ', entityId)
        let like
        if (!entityId || entityId === undefined || entityId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            like = await this.findLikeByIdRepository(entity, entityId);
        }
        if (!like) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND)
        }
        return like;
    }
}