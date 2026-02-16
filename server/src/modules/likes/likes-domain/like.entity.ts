import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { MetaType, MetaTypeSchema } from './meta-type-likes.schema';
import { CreateLikeDomainDto } from '../likes-dto/create-like.domain.dto';
import { UpdateLikeDto } from '../likes-dto/like-update.dto';

@Schema({
    // timestamps: true, 
    toJSON: { virtuals: true, versionKey: false }
})
export class Like {
    @Prop({ type: String, enum: ['Like', 'Dislike', 'None'], required: true })
    likeStatus: string;

    @Prop({ type: MetaTypeSchema })
    meta: MetaType;

    @Prop({ type: String, required: true })
    createdAt: string;

    @Prop({ type: String, required: false })
    updatedAt: string;

    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }
    static createLikeInstance(dto: CreateLikeDomainDto): LikeDocument {
        const like = new this();
        like.likeStatus = dto.likeStatus;
        like.meta = dto.meta;
        like.createdAt = new Date().toISOString();
        like.updatedAt = new Date().toISOString();
        like.deletedAt = null;

        return like as LikeDocument;
    }
    updateLike(dto: Omit<UpdateLikeDto, 'updatedAt'>) {
        if (this.id === dto.id) {
            this.likeStatus = dto.likeStatus;
            this.meta = dto.meta;
            this.updatedAt = new Date().toISOString();
        }
    }
    makeDeletedLike() {
        const date = new Date();
        if (this.deletedAt !== null) {
            throw new Error('Комментарий уже уделаен!');
        }
        this.deletedAt = date.toISOString();
    }
}
export const LikeSchema = SchemaFactory.createForClass(Like);
//регистрирует методы сущности в схеме
LikeSchema.loadClass(Like);
//Типизация документа
export type LikeDocument = HydratedDocument<Like>;
//Типизация модели + статические методы
export type LikeModelType = Model<LikeDocument> & typeof Like;