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
    static createInstance(dto: CreateCommentDomainDto): CommentDocument {
        const comment = new this();
        comment.content = dto.content;
        comment.commentatorInfo = dto.commentatorInfo;
        comment.postId = dto.postId;
        comment.createdAt = dto.createdAt;
        comment.updatedAt = dto.updatedAt;
        comment.deletedAt = dto.deletedAt;

        // comment.nameSchema = {
        //     blogs: 'firstName xxx',
        //     lastName: 'lastName yyy',
        // };

        return comment as CommentDocument;
    }
    update(dto: UpdateCommentDto) {
        if (dto.id === this.id) {
            this.content = dto.content;
            this.updatedAt = dto.updatedAt;
            this.deletedAt = dto.deletedAt;
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