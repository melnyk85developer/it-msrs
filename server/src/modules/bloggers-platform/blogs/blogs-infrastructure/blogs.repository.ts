import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from '../blogs-domain/blog.entity';
import type { BlogDocument, BlogModelType } from '../blogs-domain/blog.entity';
import { Types } from 'mongoose';

@Injectable()
export class BlogsRepository {
    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType
    ) { }

    async findBlogById(id: string): Promise<BlogDocument | null> {
        return this.BlogModel.findOne({
            _id: new Types.ObjectId(id),
            deletedAt: null,
        });
    }

    async save(blog: BlogDocument) {
        await blog.save();
    }

    async findBlogOrNotFoundFailBlogsRepository(id: string): Promise<BlogDocument> {
        let blog
        if (!id || id === undefined || id === 'undefined') {
            throw new BadRequestException('id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - id 😡😡😡 typeof', id, typeof id)
            blog = await this.findBlogById(id);
        }
        blog = await this.findBlogById(id);
        if (!blog) {
            throw new NotFoundException('blog not found');
        }

        return blog;
    }
}