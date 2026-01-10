import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Multer } from 'multer';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetBlogsQueryParams } from './input-dto-blogs/get-blogs-query-params.input-dto';
import { BlogViewDto } from './view-dto-blogs/blogs.view-dto';
import { BlogsQueryRepository } from '../blogs-infrastructure/external-query-blogs/query-blogs/blogs.query-repository';
import { CreateBlogInputDto } from './input-dto-blogs/blogs.input-dto';
import { UpdateBlogInputDto } from './input-dto-blogs/update-blogs.input-dto';
import { BlogsService } from '../blogs-application/blogs.service';
import { SuccessResponse } from 'src/core/utils/SuccessfulResponse';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PostsQueryRepository } from '../../posts/posts-infrastructure/posts-external-query/posts-query/posts.query-repository';
import { PostsService } from '../../posts/posts-application/posts.service';
import { GetPostsQueryParams } from '../../posts/posts-api/posts-input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from '../../posts/posts-api/posts-view-dto/posts.view-dto';
import { CreatePostForBlogInputDto } from './input-dto-blogs/posts-for-blog.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { AuthAccessGuard } from 'src/modules/user.accounts/users-guards/bearer/jwt-auth.guard';
import { BasicAuthGuard } from 'src/modules/user.accounts/users-guards/basic/basic-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user.accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user.accounts/users-guards/dto/user-context.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { HomePageBlogViewDto } from './view-dto-blogs/homePageBlog.view-dto';
import { UpdateHomePageBlogDto } from './input-dto-blogs/update-HomePageblog-dto';
import { AboutPageBlogViewDto } from './view-dto-blogs/aboutPageBlog.view-dto';

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
    // @UseGuards(BasicAuthGuard)
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    // @UseInterceptors(FileInterceptor('image'))
    async createBlogController(@Body() body: CreateBlogInputDto, @UploadedFile() image?: Multer.File | undefined): Promise<BlogViewDto> {
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
    @UseGuards(AuthAccessGuard)
    @Post(':blogId/posts')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileInterceptor('image'))
    async createPostForBlogController(
        @Param('blogId') blogId: string,
        @Body() body: CreatePostForBlogInputDto,
        @UploadedFile() image?: Multer.File | undefined
    ): Promise<BlogViewDto> {

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
    @UseGuards(AuthAccessGuard)
    @Put(':id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateBlogController(@Param('id') id: string, @Body() body: UpdateBlogInputDto): Promise<string> {
        // console.log('BlogsController: updateBlogController - id 😡 body ', id, body)
        const isUpdateBlog = await this.blogsService.updateBlogService(id, body);
        // console.log('BlogsController: updateBlogController - isUpdateBlog 😡 ', isUpdateBlog)
        return isUpdateBlog
    }
    @ApiOperation({ summary: 'Обновить блог по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @UseGuards(AuthAccessGuard)
    @Put('/home-page/:id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateBlogHomePageController(@Param('id') id: string, @Body() body: UpdateHomePageBlogDto): Promise<string> {
        // console.log('BlogsController: updateBlogHomePageController - id 😡 body ', id, body)
        const isUpdateBlog = await this.blogsService.updateBlogHomePageService(id, body);
        // console.log('BlogsController: updateBlogHomePageController - isUpdateBlog 😡 ', isUpdateBlog)
        return isUpdateBlog
    }
    @ApiOperation({ summary: 'Удалить блог по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404 })
    @UseGuards(AuthAccessGuard)
    @Delete(':id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteBlogController(@Param('id') id: string): Promise<void> {
        // console.log('PostsController: deleteBlogController - id 😡 ', id)
        return this.blogsService.deleteBlogService(id);
    }
    @ApiOperation({ summary: 'Получить все блоги - всех пользователей!' })
    @ApiResponse({ status: 200 })
    @Get()
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllBlogsController(@Query() query: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {
        // console.log('BlogsController: getAllBlogsController - query 😡 ', query)
        const isBlogs = await this.blogsQueryRepository.getAllBlogRepository(query)
        // console.log('BlogsController: getAllBlogsController - isBlogs 😡 ', isBlogs)
        return isBlogs
    }
    @ApiOperation({ summary: 'Получить все блоги - текущего пользователя!' })
    @ApiResponse({ status: 200 })
    @UseGuards(AuthAccessGuard)
    @Get('/my-blogs')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllMyBlogsController(@Query() query: GetBlogsQueryParams, @ExtractUserFromRequest() user: UserContextDto): Promise<PaginatedViewDto<BlogViewDto[]>> {
        // console.log('BlogsController: getAllMyBlogsController - query 😡 ', query)
        // console.log('BlogsController: getAllMyBlogsController - user 😡 ', user)
        const isBlogs = await this.blogsQueryRepository.getAllBlogRepository(query)
        // console.log('BlogsController: getAllMyBlogsController - isBlogs 😡 ', isBlogs)
        return isBlogs
    }
    @ApiOperation({ summary: 'Получить блог по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @Get(':id')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getBlogByIdController(@Param('id') id: string): Promise<BlogViewDto> {
        // console.log('BlogsController: getBlogByIdController - id 😡 ', id)
        return this.blogsQueryRepository.getBlogByIdOrNotFoundFailQueryRepository(id);
    }
    @ApiOperation({ summary: 'Получить блог по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @Get('/home-page/:id')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getHomePageBlogByIdController(@Param('id') id: string): Promise<HomePageBlogViewDto> {
        // console.log('BlogsController: getHomePageBlogByIdController - id 😡 ', id)
        const isHomePage = await this.blogsQueryRepository.getHomePageBlogByIdOrNotFoundFailQueryRepository(id);
        // console.log('BlogsController: isHomePage - 😡 ', isHomePage)
        return isHomePage
    }
    @ApiOperation({ summary: 'Получить блог по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @Get('/about-page/:id')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAboutPageBlogByIdController(@Param('id') id: string): Promise<AboutPageBlogViewDto> {
        console.log('BlogsController: getAboutPageBlogByIdController - id 😡 ', id)
        const isAboutPage = await this.blogsQueryRepository.getAboutPageBlogByIdOrNotFoundFailQueryRepository(id);
        console.log('BlogsController: isAboutPage - 😡 ', isAboutPage)
        return isAboutPage
    }
    @ApiOperation({ summary: 'Получить все посты определенного блога!' })
    @ApiResponse({ status: 200 })
    @Get('/:blogId/posts')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllPostsController(@Param('blogId') blogId: string, @Query() query: GetPostsQueryParams): Promise<PaginatedViewDto<PostViewDto[]>> {
        // console.log('PostsController: getAllPostsController - query 😡 blogId', query, blogId)
        const isPosts = await this.postsQueryRepository.getAllPostRepository(query, blogId);
        // console.log('PostsController: getAllPostsController - isPosts 😡 ', isPosts)
        return isPosts
    }
}