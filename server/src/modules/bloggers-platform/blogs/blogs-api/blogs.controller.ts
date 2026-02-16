import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Multer } from 'multer';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetBlogsQueryParams } from './input-dto-blogs/get-blogs-query-params.input-dto';
import { BlogViewDto } from './view-dto-blogs/blogs.view-dto';
import { BlogsQueryRepository } from '../blogs-infrastructure/external-query-blogs/query-blogs/blogs.query-repository';
import { CreateBlogInputDto } from './input-dto-blogs/blogs.input-dto';
import { UpdateBlogInputDto } from './input-dto-blogs/update-blogs.input-dto';
import { SuccessResponse } from 'src/core/utils/SuccessfulResponse';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PostsQueryRepository } from '../../posts/posts-infrastructure/posts-external-query/posts-query/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/posts-api/posts-input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from '../../posts/posts-api/posts-view-dto/posts.view-dto';
import { CreatePostForBlogInputDto } from './input-dto-blogs/posts-for-blog.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { BasicAuthGuard } from 'src/modules/user-accounts/users-guards/basic/basic-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { HomePageBlogViewDto } from './view-dto-blogs/homePageBlog.view-dto';
import { UpdateHomePageBlogDto } from './input-dto-blogs/update-HomePageblog-dto';
import { AboutPageBlogViewDto } from './view-dto-blogs/aboutPageBlog.view-dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../blogs-application/blogs.use-cases/create-blog.use-case';
import { UpdateBlogCommand } from '../blogs-application/blogs.use-cases/update-blog.use-case';
import { UpdateBlogHomePageCommand } from '../blogs-application/blogs.use-cases/update-blog-home-page.use-case';
import { DeleteBlogCommand } from '../blogs-application/blogs.use-cases/delete-blog.use-case';
import { CreatePostOneBlogCommand } from '../../posts/posts-application/posts.use-cases/create-post-one-blog.use-case';

@Controller('/blogs')
export class BlogsController {
    constructor(
        private commandBus: CommandBus,
        private blogsQueryRepository: BlogsQueryRepository,
        private postsQueryRepository: PostsQueryRepository,
    ) { }

    @ApiOperation({ summary: 'Создать блог!' })
    @ApiResponse({ status: 201 })
    // @UseGuards(BasicAuthGuard)
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileInterceptor('image'))
    async createBlogController(
        @Body() body: CreateBlogInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile() image?: Multer.File | undefined,
    ): Promise<BlogViewDto> {
        // console.log('BlogsController: createBlogController - REQ body 😡 ', body)
        const blogId = await this.commandBus.execute<CreateBlogCommand, string>(
            new CreateBlogCommand(user.id, body, image)
        );
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
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile() image?: Multer.File | undefined
    ): Promise<BlogViewDto> {
        // console.log('BlogsController: createPostForBlogController - body, blogId 😡 ', body, blogId)
        // const postId = await this.postsService.createPostOneBlogService(body, blogId);
        const postId = await this.commandBus.execute<CreatePostOneBlogCommand, string>(
            new CreatePostOneBlogCommand(user.id, body, blogId, image)
        );
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
    @UseInterceptors(FileInterceptor('image'))
    async updateBlogController(
        @Param('id') id: string,
        @Body() body: UpdateBlogInputDto,
        @UploadedFile() image?: Multer.File | undefined
    ): Promise<string> {
        // console.log('BlogsController: updateBlogController - id 😡 body ', id, body)
        const isUpdateBlog = await this.commandBus.execute<UpdateBlogCommand, string>(
            new UpdateBlogCommand(id, body, image)
        );
        // console.log('BlogsController: updateBlogController - isUpdateBlog 😡 ', isUpdateBlog)
        return isUpdateBlog
    }
    @ApiOperation({ summary: 'Обновить блог по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @UseGuards(AuthAccessGuard)
    @Put('/home-page/:id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateBlogHomePageController(
        @Param('id') id: string,
        @Body() body: UpdateHomePageBlogDto,
        @UploadedFile() image?: Multer.File | undefined
    ): Promise<string> {
        // console.log('BlogsController: updateBlogHomePageController - id 😡 body ', id, body)
        const isUpdateBlogHomePage = await this.commandBus.execute<UpdateBlogHomePageCommand, string>(
            new UpdateBlogHomePageCommand(id, body, image)
        );
        // console.log('BlogsController: updateBlogHomePageController - isUpdateBlog 😡 ', isUpdateBlog)
        return isUpdateBlogHomePage
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
        return await this.commandBus.execute<DeleteBlogCommand, void>(
            new DeleteBlogCommand(id)
        );
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
        // console.log('BlogsController: getAboutPageBlogByIdController - id 😡 ', id)
        const isAboutPage = await this.blogsQueryRepository.getAboutPageBlogByIdOrNotFoundFailQueryRepository(id);
        // console.log('BlogsController: isAboutPage - 😡 ', isAboutPage)
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