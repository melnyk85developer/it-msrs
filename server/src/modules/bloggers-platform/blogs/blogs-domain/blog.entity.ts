import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { UpdateBlogDto } from '../blogs-dto/create-blog.dto';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';
import { NotFoundException } from '@nestjs/common';

@Schema({
    // timestamps: true, 
    toJSON: { virtuals: true, versionKey: false }
})
export class Blog {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    websiteUrl: string;

    @Prop({ type: String, required: true })
    createdAt: string;

    @Prop({ type: String, required: false })
    updatedAt: string;

    @Prop({ type: Boolean, required: true })
    isMembership: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ type: String, required: false, nullable: true })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }
    static createBlogInstance(dto: Omit<CreateBlogDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): BlogDocument {
        // console.log('BlogsEntity: createInstance - dto 😡 ', dto)
        const blog = new this();

        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        blog.userId = dto.userId;
        blog.isMembership = false;
        blog.createdAt = new Date().toISOString();
        blog.updatedAt = new Date().toISOString();
        blog.deletedAt = null;

        // console.log('BlogsEntity: createInstance - blog 😡 ', blog)
        return blog as BlogDocument;
    }
    update(dto: UpdateBlogDto) {
        if (dto.id !== this.id) {
            this.name = dto.name;
            this.description = dto.description;
            this.websiteUrl = dto.websiteUrl;
            this.isMembership = false;
            this.updatedAt = new Date().toISOString();
            this.deletedAt = null
        }
    }
    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new NotFoundException('Блог уже удален!');
        }
        this.deletedAt = new Date().toISOString();
    }
}
export const BlogSchema = SchemaFactory.createForClass(Blog);
//регистрирует методы сущности в схеме
BlogSchema.loadClass(Blog);
// Подключает виртуально BlogSchema в UserSchema
BlogSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'postId',
});
//Типизация документа
export type BlogDocument = HydratedDocument<Blog>;
//Типизация модели + статические методы
export type BlogModelType = Model<BlogDocument> & typeof Blog;