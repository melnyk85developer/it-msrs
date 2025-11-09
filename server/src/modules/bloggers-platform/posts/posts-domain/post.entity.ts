import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { CreatePostDomainDto } from './post-dto/create-post.domain.dto';
import { UpdatePostDto } from '../posts-dto/create-post.dto';

@Schema({
    // timestamps: true,
    toJSON: { virtuals: true, versionKey: false }
})
export class Post {
    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    shortDescription: string;

    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true })
    blogId: string;

    @Prop({ type: String, required: true })
    blogName: string;

    @Prop({ type: String, required: true })
    createdAt: string;

    @Prop({ type: String, required: true })
    updatedAt: string;

    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }
    static createPostInstance(dto: Omit<CreatePostDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): PostDocument {
        const post = new this();

        post.title = dto.title;
        post.content = dto.content;
        post.shortDescription = dto.shortDescription;
        post.blogId = dto.blogId;
        post.blogName = dto.blogName;
        post.createdAt = new Date().toISOString();
        post.updatedAt = new Date().toISOString();
        post.deletedAt = null;

        return post as PostDocument;
    }
    update(dto: Omit<UpdatePostDto, 'createdAt' | 'updatedAt' | 'deletedAt'>) {
        // console.log('PostsEntity: dto 😡 ', dto)
        if (dto.id === this.id) {
            this.title = dto.title;
            this.shortDescription = dto.shortDescription;
            this.content = dto.content;
            this.blogId = dto.blogId;
            // this.createdAt = new Date().toISOString();
            this.updatedAt = new Date().toISOString();
            this.deletedAt = null
        }
    }
    makeDeleted() {
        const date = new Date();
        if (this.deletedAt !== null) {
            throw new Error('Пост уже удален!');
        }
        this.deletedAt = date.toISOString();
    }
}

export const PostSchema = SchemaFactory.createForClass(Post);

//регистрирует методы сущности в схеме
PostSchema.loadClass(Post);
PostSchema.virtual('comments', {
    ref: 'Comments',
    localField: '_id',
    foreignField: 'commentId',
});
//Типизация документа
export type PostDocument = HydratedDocument<Post>;

//Типизация модели + статические методы
export type PostModelType = Model<PostDocument> & typeof Post;