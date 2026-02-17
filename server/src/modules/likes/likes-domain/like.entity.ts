import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { MetaType, MetaTypeSchema } from './meta-type-likes.schema';
import { CreateLikeDomainDto } from '../likes-dto/create-like.domain.dto';
import { LikeStatus, UpdateLikeDto } from '../likes-dto/like-update.dto';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
    // timestamps: true, 
    toJSON: { virtuals: true, versionKey: false }
})
export class Like {
    @ApiProperty({ example: 'likeStatus', description: 'Статус лайка - Like, Dislike или None!' })
    @Prop({ type: String, required: true })
    likeStatus: string;

    @ApiProperty({ example: 'meta', description: 'Метаданные пользователя, кто оставил Like, название какой сущьности оставили Like и id сущьности!' })
    @Prop({ type: MetaTypeSchema, required: true })
    meta: MetaType;

    @ApiProperty({ example: 'createdAt', description: 'Число создания Like.' })
    @Prop({ type: String, required: true })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Число обновления Like.' })
    @Prop({ type: String, required: false })
    updatedAt: string;

    @ApiProperty({ example: 'deletedAt', description: 'Число удаления  Like.' })
    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }
    static createLikeInstance(dto: CreateLikeDomainDto): LikeDocument {
        console.log('createLikeInstance 😡 dto', dto)
        const like = new this();
        like.likeStatus = dto.likeStatus;
        like.meta = dto.meta;
        like.createdAt = new Date().toISOString();
        like.updatedAt = new Date().toISOString();
        like.deletedAt = null;
        console.log('createLikeInstanceo 😡 like', like)
        return like as LikeDocument;
    }
    updateLike(dto: Omit<UpdateLikeDto, 'updatedAt'>) {
        if (this.id === dto.id) {
            this.likeStatus = dto.likeStatus;
            this.meta = dto.meta;
            this.createdAt = this.createdAt;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = this.deletedAt;
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