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

    // @Prop({ type: PostSchema })
    // nameSchema: Post;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }
    static createInstance(dto: CreatePostDomainDto): PostDocument {
        const post = new this();
        post.title = dto.title;
        post.content = dto.content;
        post.shortDescription = dto.shortDescription;
        post.blogId = dto.blogId;
        post.blogName = dto.blogName;
        post.createdAt = dto.createdAt;
        post.updatedAt = dto.updatedAt;
        post.deletedAt = dto.deletedAt;

        // user.nameSchema = {
        //     blogs: 'firstName xxx',
        //     lastName: 'lastName yyy',
        // };

        return post as PostDocument;
    }
    update(dto: UpdatePostDto) {
        // console.log('PostsEntity: dto 😡 ', dto)
        if (dto.id === this.id) {
            this.title = dto.title;
            this.shortDescription = dto.shortDescription;
            this.content = dto.content;
            this.blogId = dto.blogId;
            this.createdAt = dto.createdAt;
            this.updatedAt = dto.updatedAt;
            this.deletedAt = dto.deletedAt;
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