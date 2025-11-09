import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../posts-domain/post.schema';
import { CreatePostDto, CreatePostForBlogDto, UpdatePostDto } from '../posts-dto/create-post.dto';
import { type PostModelType } from '../posts-domain/post.entity';
import { PostsRepository } from '../posts-infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/blogs-infrastructure/blogs.repository';
import { Types } from 'mongoose';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private PostModel: PostModelType,
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
    ) { }

    async createPostService(dto: Omit<CreatePostDto, 'createdAt' | 'updatedAt' | 'deletedAt' | 'blogName'>): Promise<string> {
        // console.log('PostsService: createPostService: dto 😡 ', dto)
        const isBlog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(dto.blogId);
        // console.log('PostsService: createPostService: isBlog IF 😡 ', isBlog)
        const post = this.PostModel.createPostInstance({
            ...dto,
            blogId: String(isBlog._id),
            blogName: isBlog.name
        });
        await this.postsRepository.save(post);
        return post._id.toString();
    }
    async createPostOneBlogService(dto: Omit<CreatePostForBlogDto, 'createdAt' | 'updatedAt' | 'deletedAt' | 'blogName'>, blogId: string): Promise<string> {
        // console.log('PostsService: createPostOneBlogService: dto.blogId 😡 ELSE', blogId)
        const isBlog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(blogId);
        // console.log('PostsService: createPostOneBlogService: isBlog 😡 ELSE', isBlog)
        const post = this.PostModel.createPostInstance({
            ...dto,
            blogId: blogId,
            blogName: isBlog.name
        });
        await this.postsRepository.save(post);
        return post._id.toString();
    }
    async updatePostService(id: string, dto: Omit<UpdatePostDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<string> {
        // console.log('PostsService: updatePostService: id REQ dto 😡 ', id, dto)
        const post = await this.postsRepository.findPostOrNotFoundFail(id);
        // console.log('PostsService: updatePostService: IsPost 😡 ', post)
        post.update({ ...dto, id });
        await this.postsRepository.save(post);
        return post._id.toString();
    }
    async deletePostService(id: string) {
        const post = await this.postsRepository.findPostOrNotFoundFail(id);
        post.makeDeleted();
        await this.postsRepository.save(post);
    }
}