import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, type BlogModelType } from '../../blogs-domian/blog.entity';
import { BlogExternalDto } from './external-dto/blogs.external-dto';

@Injectable()
export class BlogsExternalQueryRepository {
    constructor(
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
    ) { }

    async getBlogByIdOrNotFoundFailExternalQuery(id: string): Promise<BlogExternalDto> {
        const blog = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!blog) {
            throw new NotFoundException('blog not found');
        }

        return BlogExternalDto.mapToView(blog);
    }
}