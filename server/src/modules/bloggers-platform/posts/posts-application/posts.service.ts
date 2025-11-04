import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../posts-domian/post.schema';
import { CreatePostDto, CreatePostForBlogDto, UpdatePostDto } from '../posts-dto/create-post.dto';
import { type PostModelType } from '../posts-domian/post.entity';
import { PostsRepository } from '../posts-infrastructure/posts.repository';
import { Types } from 'mongoose';
import { BlogsRepository } from '../../blogs/blogs-infrastructure/blogs.repository';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private PostModel: PostModelType,
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
    ) { }

    async createPostService(dto: Omit<CreatePostDto, 'deletedAt' | 'blogName' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const date = new Date();
        const createdAt = date.toISOString();
        const updatedAt = date.toISOString();
        let isBlog
        let post
        // console.log('PostsService: createPostService: dto 😡 ', dto)
        isBlog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(dto.blogId);
        // console.log('PostsService: createPostService: isBlog IF 😡 ', isBlog)
        post = this.PostModel.createInstance({
            ...dto,
            blogId: isBlog._id,
            blogName: isBlog.name,
            createdAt: createdAt,
            updatedAt: updatedAt,
            deletedAt: null
        });
        await this.postsRepository.save(post);
        return post._id.toString();
    }
    async createPostOneBlogService(dto: Omit<CreatePostForBlogDto, 'deletedAt' | 'blogName' | 'createdAt' | 'updatedAt'>, blogId: string): Promise<string> {
        const date = new Date();
        const createdAt = date.toISOString();
        const updatedAt = date.toISOString();
        let isBlog
        let post

        // console.log('PostsService: createPostOneBlogService: dto.blogId 😡 ELSE', blogId)
        isBlog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(blogId);
        // console.log('PostsService: createPostOneBlogService: isBlog 😡 ELSE', isBlog)
        post = this.PostModel.createInstance({
            ...dto,
            blogId: blogId,
            blogName: isBlog.name,
            createdAt: createdAt,
            updatedAt: updatedAt,
            deletedAt: null
        });
        await this.postsRepository.save(post);
        return post._id.toString();
    }
    async updatePostService(id: string, dto: Omit<UpdatePostDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<string> {
        // console.log('PostsService: updatePostService: id REQ dto 😡 ', id, dto)
        const post = await this.postsRepository.findPostOrNotFoundFail(id);
        // console.log('PostsService: updatePostService: IsPost 😡 ', post)
        const blog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(post.blogId);
        // console.log('PostsService: updatePostService: IsBlog 😡 ', blog)

        const date = new Date();
        const updatedAt = date.toISOString();

        // не присваиваем св-ва сущностям напрямую в сервисах! даже для изменения одного св-ва
        // создаём метод
        post.update(
            {
                ...dto,
                id,
                createdAt: post.createdAt,
                updatedAt: updatedAt,
                deletedAt: null
            }
        ); // change detection
        await this.postsRepository.save(post);
        return post._id.toString();
    }
    async deletePostService(id: string) {
        const post = await this.postsRepository.findPostOrNotFoundFail(id);
        post.makeDeleted();
        await this.postsRepository.save(post);
    }
}