import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../blogs-domian/blog.entity';
import type { BlogModelType } from '../blogs-domian/blog.entity';
import { BlogsRepository } from '../blogs-infrastructure/blogs.repository';
import { CreateBlogDto, UpdateBlogDto } from '../blogs-dto/create-blog.dto';
import { Types } from 'mongoose';

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType,
        private blogsRepository: BlogsRepository,
    ) { }

    async createBlogService(dto: Omit<CreateBlogDto, 'userId' | 'updatedAt' | 'createdAt'>): Promise<string> {
        // console.log('BlogsService: createBlogService - dto 😡 REQ', dto)
        const date = new Date();
        const createdAt = date.toISOString();
        const blog = this.BlogModel.createInstance({
            ...dto,
            userId: new Types.ObjectId(),
            isMembership: false,
            createdAt: createdAt,
            updatedAt: createdAt,
            deletedAt: null
        });
        // console.log('BlogsService: createBlogService - blog 😡 PREV SAVE', blog)
        await this.blogsRepository.save(blog);
        // console.log('BlogsService: createBlogService - blog 😡 SAVE', blog)
        return blog._id.toString();
    }
    async updateBlogService(id: string, dto: Omit<UpdateBlogDto, 'updatedAt' | 'isMembership'>): Promise<string> {
        const date = new Date();
        const updatedAt = date.toISOString();
        const blog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(id);
        // не присваиваем св-ва сущностям напрямую в сервисах! даже для изменения одного св-ва
        // создаём метод
        // console.log('BlogsService: updateBlogService - id, dto 😡 ', id, dto)
        // console.log('BlogsService: updateBlogService - id, dto, blog 😡 ', id, dto, blog)
        blog.update({
            ...dto,
            isMembership: false,
            updatedAt: updatedAt,
            deletedAt: null
        }); // change detection
        // console.log('BlogsService: PREV SAVE - blog 😡 ', blog)
        await this.blogsRepository.save(blog);
        return blog._id.toString();
    }

    async deleteBlogService(id: string) {
        // console.log('BlogsService: deleteBlogService - id 😡😡😡 ', id)
        const blog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(id);
        // console.log('BlogsService: deleteBlogService - IsBlog 😡😡😡 ', blog)
        blog.makeDeleted();
        // console.log('BlogsService: deleteBlogService - blog is deleted 😡😡😡 ???', blog)
        await this.blogsRepository.save(blog);
    }
}