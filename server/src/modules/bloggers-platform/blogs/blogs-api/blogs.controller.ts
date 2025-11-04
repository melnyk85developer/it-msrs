import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetBlogsQueryParams } from './input-dto-blogs/get-blogs-query-params.input-dto';
import { BlogViewDto } from './view-dto-blogs/blogs.view-dto';
import { BlogsQueryRepository } from '../blogs-infrastructure/external-query-blogs/query-blogs/blogs.query-repository';
import { CreateBlogInputDto } from './input-dto-blogs/blogs.input-dto';
import { UpdateBlogInputDto } from './input-dto-blogs/update-blogs.input-dto';
import { BlogsService } from '../blogs-application/blogs.service';
import { ValidationCreateBlogInterceptor } from '../blogs-interceptors/blog-create-validation-interceptor';
import { SuccessResponse } from 'src/shared/utils/SuccessfulResponse';
import { INTERNAL_STATUS_CODE } from 'src/shared/utils/utils';
import { ValidationUpdateBlogInterceptor } from '../blogs-interceptors/blog-update-validation-interceptor';
import { ErRes } from 'src/shared/utils/ErRes';
import { CreatePostInputDto } from '../../posts/posts-api/posts-input-dto/posts.input-dto';
import { PostsQueryRepository } from '../../posts/posts-infrastructure/posts-external-query/posts-query/posts.query-repository';
import { PostsService } from '../../posts/posts-application/posts.service';
import { GetPostsQueryParams } from '../../posts/posts-api/posts-input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from '../../posts/posts-api/posts-view-dto/posts.view-dto';
import { ValidationCreatePostInterceptor } from '../../posts/posts-interceptors/post-create-validation-interceptor';
import { ValidationCreatePostForBlogInterceptor } from '../blogs-interceptors/post-for-blog-create-validation-interceptor';
import { ValidationDeleteBlogInterceptor } from '../blogs-interceptors/blog-delete-validation-interceptor';
import { ValidationGetPostForBlogInterceptor } from '../blogs-interceptors/get-post-for-blog-validation-interceptor';
import { CreatePostForBlogInputDto } from './input-dto-blogs/posts-for-blog.input-dto';

@Controller('/blogs')
export class BlogsController {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private blogsService: BlogsService,
        private postsQueryRepository: PostsQueryRepository,
        private postsService: PostsService,
    ) { }

    @ApiOperation({ summary: 'Создать блог!' })
    @ApiResponse({ status: 201 })
    @UseInterceptors(ValidationCreateBlogInterceptor)
    @Post()
    async createBlogController(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
        // console.log('BlogsController: createBlogController - REQ body 😡 ', body)
        const blogId = await this.blogsService.createBlogService(body);
        // console.log('BlogsController: createBlogController - RES blogId REQ 😡 ', blogId)
        const isCreatedBlog = await this.blogsQueryRepository.getBlogByIdOrNotFoundFailQueryRepository(blogId);
        // console.log('BlogsController: createBlogController - RES isCreatedBlog.id 😡 ', isCreatedBlog.id)
        return SuccessResponse(
            INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG,
            isCreatedBlog
        );
    }
    @ApiOperation({ summary: 'Создать пост конкретному блогу!' })
    @ApiResponse({ status: 201 })
    @UseInterceptors(ValidationCreatePostForBlogInterceptor)
    @Post('/:blogId/posts')
    async createPostForBlogController(@Param('blogId') blogId: string, @Body() body: CreatePostForBlogInputDto): Promise<BlogViewDto> {
        // console.log('BlogsController: createPostForBlogController - body, blogId 😡 ', body, blogId)
        const postId = await this.postsService.createPostOneBlogService(body, blogId);
        // console.log('BlogsController: createPostForBlogController - postId 😡 ', postId)
        const isCreatedPost = await this.postsQueryRepository.getPostByIdOrNotFoundFailQueryRepository(postId);
        // console.log('BlogsController: createPostForBlogController - isCreatedPost 😡 ', isCreatedPost)
        return SuccessResponse(
            INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST,
            isCreatedPost
        );
    }
    @ApiOperation({ summary: 'Обновить блог по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @UseInterceptors(ValidationUpdateBlogInterceptor)
    @Put(':id')
    async updateBlogController(@Param('id') id: string, @Body() body: UpdateBlogInputDto): Promise<BlogViewDto> {
        // console.log('BlogsController: updateBlogController - id 😡 body ', id, body)
        const isUpdateBlog = await this.blogsService.updateBlogService(id, body);
        // console.log('BlogsController: updateBlogController - isUpdateBlog 😡 ', isUpdateBlog)
        if (isUpdateBlog) {
            return SuccessResponse(INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG);
        } else {
            throw new ErRes(INTERNAL_STATUS_CODE.BAD_REQUEST)
        }
    }
    @ApiOperation({ summary: 'Удалить блог по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404 })
    @UseInterceptors(ValidationDeleteBlogInterceptor)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlogController(@Param('id') id: string): Promise<void> {
        // console.log('PostsController: deleteBlogController - id 😡 ', id)
        return this.blogsService.deleteBlogService(id);
    }
    @ApiOperation({ summary: 'Получить все блоги!' })
    @ApiResponse({ status: 200 })
    @Get()
    async getAllBlogsController(@Query() query: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {
        // console.log('BlogsController: getAllBlogsController - query 😡 ', query)
        const isBlogs = await this.blogsQueryRepository.getAllBlogRepository(query)
        // console.log('BlogsController: getAllBlogsController - isBlogs 😡 ', isBlogs)
        return isBlogs
    }
    @ApiOperation({ summary: 'Получить блог по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @Get(':id')
    async getBlogByIdController(@Param('id') id: string): Promise<BlogViewDto> {
        // console.log('BlogsController: getBlogByIdController - id 😡 ', id)
        return this.blogsQueryRepository.getBlogByIdOrNotFoundFailQueryRepository(id);
    }
    @ApiOperation({ summary: 'Получить все посты определенного блога!' })
    @ApiResponse({ status: 200 })
    @UseInterceptors(ValidationGetPostForBlogInterceptor)
    @Get('/:blogId/posts')
    async getAllPostsController(@Param('blogId') blogId: string, @Query() query: GetPostsQueryParams): Promise<PaginatedViewDto<PostViewDto[]>> {
        // console.log('PostsController: getAllPostsController - query 😡 blogId', query, blogId)
        const isPosts = await this.postsQueryRepository.getAllPostRepository(query, blogId);
        // console.log('PostsController: getAllPostsController - isPosts 😡 ', isPosts)
        return isPosts
    }
}