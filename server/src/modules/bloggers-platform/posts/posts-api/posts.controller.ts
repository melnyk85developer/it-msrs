import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetPostsQueryParams } from './posts-input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from './posts-view-dto/posts.view-dto';
import { CreatePostInputDto } from './posts-input-dto/posts.input-dto';
import { UpdatePostInputDto } from './posts-input-dto/posts-update.input-dto';
import { PostsQueryRepository } from '../posts-infrastructure/posts-external-query/posts-query/posts.query-repository';
import { PostsService } from '../posts-application/posts.service';
import { ValidationCreatePostInterceptor } from '../posts-interceptors/post-create-validation-interceptor';
import { ValidationUpdatePostInterceptor } from '../posts-interceptors/post-update-validation-interceptor';
import { SuccessResponse } from 'src/shared/utils/SuccessfulResponse';
import { ErRes } from 'src/shared/utils/ErRes';
import { INTERNAL_STATUS_CODE } from 'src/shared/utils/utils';
import { GetCommentsQueryParams } from '../../comments/comments-api/comments-input-dto/get-comments-query-params.input-dto';
import { CommentsQueryRepository } from '../../comments/comments-infrastructure/comments-external-query/comments-query/comments.query-repository';
import { CommentViewDto } from '../../comments/comments-api/comments-view-dto/comments.view-dto';
import { ValidationCreateCommentInterceptor } from '../../comments/comments-interceptors/comment-create-validation-interceptor';
import { CommentsService } from '../../comments/comments-application/comments.service';
import { CreateCommentInputDto } from '../../comments/comments-api/comments-input-dto/comments.input-dto';

@Controller('posts')
export class PostsController {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private commentsQueryRepository: CommentsQueryRepository,
        private postsService: PostsService,
        private commentsService: CommentsService
    ) { }

    @ApiOperation({ summary: 'Создать пост!' })
    @ApiResponse({ status: 201 })
    @UseInterceptors(ValidationCreatePostInterceptor)
    @Post()
    async createPostController(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
        // console.log('PostsController: createPostController - body 😡 ', body)
        const postId = await this.postsService.createPostService(body);
        // console.log('PostsController: createPostController - postId 😡 ', postId)
        return this.postsQueryRepository.getPostByIdOrNotFoundFailQueryRepository(postId);
    }

    @ApiOperation({ summary: 'Создать комментарий определенному посту!' })
    @ApiResponse({ status: 201 })
    @UseInterceptors(ValidationCreateCommentInterceptor)
    @Post('/:postId/comments')
    async createCommentForPostController(@Body() body: CreateCommentInputDto): Promise<CommentViewDto> {
        // console.log('PostsController: createCommentForPostController - body 😡 ', body)
        const commentId = await this.commentsService.createCommentService(body);

        return this.commentsQueryRepository.getCommentByIdOrNotFoundFailRepository(commentId);
    }

    @ApiOperation({ summary: 'Обновить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @UseInterceptors(ValidationUpdatePostInterceptor)
    @Put(':id')
    async updatePostController(@Param('id') id: string, @Body() body: UpdatePostInputDto): Promise<PostViewDto> {
        // console.log('PostsController: updatePostController - id, body 😡 ', id, body)
        const postId = await this.postsService.updatePostService(id, body);
        // console.log('PostsController: updatePostController - postId 😡 ', postId)
        const isPost = await this.postsQueryRepository.getPostByIdOrNotFoundFailQueryRepository(postId)
        // console.log('PostsController: updatePostController - isPost 😡 ', isPost)
        if (isPost.id) {
            return SuccessResponse(INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST);
        } else {
            throw new ErRes(INTERNAL_STATUS_CODE.BAD_REQUEST)
        }
    }

    @ApiOperation({ summary: 'Удалить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404 })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostController(@Param('id') id: string): Promise<void> {
        // console.log('PostsController: deletePostController - id 😡 ', id)
        return this.postsService.deletePostService(id);
    }

    @ApiOperation({ summary: 'Получить все посты!' })
    @ApiResponse({ status: 200 })
    @Get()
    async getAllPostsController(@Query() query: GetPostsQueryParams): Promise<PaginatedViewDto<PostViewDto[]>> {
        // console.log('PostsController: getAllPostsController - query 😡 ', query)
        const isPosts = await this.postsQueryRepository.getAllPostRepository(query);
        // console.log('PostsController: getAllPostsController - isPosts 😡 ', isPosts)
        return isPosts
    }
    @ApiOperation({ summary: 'Получить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @Get(':id')
    async getPostByIdController(@Param('id') id: string): Promise<PostViewDto> {
        return this.postsQueryRepository.getPostByIdOrNotFoundFailQueryRepository(id);
    }
    @ApiOperation({ summary: 'Получить все комментарии определенного поста!' })
    @ApiResponse({ status: 200 })
    @Get('/:postId/comments')
    async getAllCommentsController(@Query() query: GetCommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>> {
        // console.log('CommentsController: getAllCommentsController - query 😡 ', query)
        const isComments = await this.commentsQueryRepository.getAllCommentsRepository(query);
        // console.log('CommentsController: getAllCommentsController - isComments 😡 ', isComments)
        return isComments
    }
}