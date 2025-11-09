import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { CreateCommentDomainDto } from './comments-dto/create-comments.domain.dto';
import { UpdateCommentDto } from '../comments-dto/create-comments.dto';
import { CommentatorInfoSchema } from './commentatorInfo.schema';
import { CommentatorInfo } from './commentatorInfo.schema';

@Schema({
    // timestamps: true, 
    toJSON: { virtuals: true, versionKey: false }
})
export class Comment {
    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: CommentatorInfoSchema })
    commentatorInfo: CommentatorInfo;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
    postId: string;

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
    static createCommentInstance(dto: Omit<CreateCommentDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): CommentDocument {
        const comment = new this();

        comment.content = dto.content;
        comment.commentatorInfo = dto.commentatorInfo;
        comment.postId = dto.postId;
        comment.createdAt = new Date().toISOString();
        comment.updatedAt = new Date().toISOString();
        comment.deletedAt = null;

        return comment as CommentDocument;
    }
    update(dto: Omit<UpdateCommentDto, 'updatedAt'>) {
        if (dto.id === this.id) {
            this.content = dto.content;
            this.updatedAt = new Date().toISOString();
        }
    }
    makeDeleted() {
        const date = new Date();
        if (this.deletedAt !== null) {
            throw new Error('Комментарий уже уделаен!');
        }
        this.deletedAt = date.toISOString();
    }
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
//регистрирует методы сущности в схеме
CommentSchema.loadClass(Comment);
//Типизация документа
export type CommentDocument = HydratedDocument<Comment>;
//Типизация модели + статические методы
export type CommentModelType = Model<CommentDocument> & typeof Comment;