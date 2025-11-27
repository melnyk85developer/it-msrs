import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from '../blogs-domain/blog.entity';
import type { BlogDocument, BlogModelType } from '../blogs-domain/blog.entity';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

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

    async findBlogOrNotFoundFailRepository(id: string): Promise<BlogDocument> {
        let blog
        if (!id || id === undefined || id === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            blog = await this.findBlogById(id);
        }
        if (!blog) {
            throw new DomainException(INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID);
        }
        return blog;
    }
}