import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../blogs-domain/blog.entity';
import type { BlogModelType } from '../blogs-domain/blog.entity';
import { BlogsRepository } from '../blogs-infrastructure/blogs.repository';
import { CreateBlogDto, UpdateBlogDto } from '../blogs-dto/create-blog.dto';
import { Types } from 'mongoose';
import { UpdateHomePageBlogDto } from '../blogs-api/input-dto-blogs/update-HomePageblog-dto';

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType,
        private blogsRepository: BlogsRepository,
    ) { }

    async createBlogService(dto: Omit<CreateBlogDto, 'userId'>): Promise<string> {
        const blog = this.BlogModel.createBlogInstance({
            ...dto,
            userId: String(new Types.ObjectId())
        });
        await this.blogsRepository.save(blog);
        return blog._id.toString();
    }
    async updateBlogService(id: string, dto: UpdateBlogDto): Promise<string> {
        const blog = await this.blogsRepository.findBlogOrNotFoundFailRepository(id);
        blog.updateBlogData(dto);
        // console.log('BlogsService: updateBlogService - blog 😡 ', blog)
        await this.blogsRepository.save(blog);
        return blog._id.toString();
    }
    async updateBlogHomePageService(id: string, dto: UpdateHomePageBlogDto): Promise<string> {
        const blog = await this.blogsRepository.findBlogOrNotFoundFailRepository(id);
        blog.updateHomePageBlogData(dto);
        console.log('BlogsService: updateBlogHomePageService - blog 😡 ', blog)
        await this.blogsRepository.save(blog);
        return blog._id.toString();
    }
    async deleteBlogService(id: string) {
        const blog = await this.blogsRepository.findBlogOrNotFoundFailRepository(id);
        blog.makeDeleted();
        await this.blogsRepository.save(blog);
    }
}