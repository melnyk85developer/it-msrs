import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Like, type LikeModelType } from "../likes-domain/like.entity";
import { sanitizedQueryType } from "../likes-dto/types";


@Injectable()
export class LikesQueryRepository {
    constructor(
        @InjectModel(Like.name) private LikeModel: LikeModelType,
    ) { }
    async getAllLikesCommentRepository(entityId: string, entity: string): Promise<Like[] | null> {
        try {
            const likes = await this.LikeModel.find(
                {
                    'meta.entityType': entity,
                    'meta.entityId': entityId
                }
            )
            // .toArray();
            const isLikesComment = await this._arrLikesCommentMapForRender(likes)
            // console.log('getAllLikesCommentRepository: - isLikesComment 😡😡😡', isLikesComment)
            if (isLikesComment && isLikesComment !== undefined) {
                // console.log('getAllLikesCommentRepository: - isLikesComment 😡😡😡', isLikesComment)
                return isLikesComment
            } else {
                return null
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    async getAllLikeForCommentRepository(entityId: string, entity: string, likeStatus: string): Promise<number | null> {
        try {
            return await this.LikeModel.countDocuments(
                {
                    'meta.entityType': entity,
                    'meta.entityId': entityId,
                    likeStatus: likeStatus
                }
            )
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    async getLikeByIdRepository(id: string, entity: string): Promise<any | null> {
        // console.log('LikeQueryRepository: - id 😡', id)
        try {
            const getLike = await this.LikeModel.findOne(
                {
                    'meta.entityId': new ObjectId(id),
                    'meta.entityType': entity
                }
            )
            if (getLike && getLike.likeStatus) {
                // console.log('LikeQueryRepository: - getLike 😡😡😡', getLike)
                return await this._likeMapForRender(getLike.toObject())
            } else {
                return null
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async _likeMapForRender(like: any): Promise<any> {
        // console.log('_likeMapForRender: - like 😡😡😡', like)
        const { _id, createdAt, updatedAt, meta, likeStatus } = like
        const likesInfo = {
            id: _id,
            likeStatus: likeStatus,
            createdAt: createdAt,
            updatedAt: updatedAt,
            meta: meta,
        }
        return likesInfo
    }
    async _getCommentsCount(sanitizedQuery: sanitizedQueryType, postId?: string): Promise<number | null> {
        const filter: any = {};
        const { searchNameTerm } = sanitizedQuery;
        if (postId) { filter.postId = postId }
        if (searchNameTerm) { filter.content = { $regex: searchNameTerm, $options: 'i' }; }
        try {
            return await this.LikeModel.countDocuments(filter).lean()
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    async _arrLikesCommentMapForRender(arrLikesComment: any[]): Promise<any> {
        const resLikesComment: any[] = [];
        for (let i = 0; i < arrLikesComment.length; i++) {
            let like = await this._likeMapForRender(arrLikesComment[i]);
            resLikesComment.push(like);
        }
        return resLikesComment
    }
}