import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetPostsQueryParams } from './posts-input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from './posts-view-dto/posts.view-dto';
import { CreatePostInputDto } from './posts-input-dto/posts.input-dto';
import { UpdatePostInputDto } from './posts-input-dto/posts-update.input-dto';
import { PostsQueryRepository } from '../posts-infrastructure/posts-external-query/posts-query/posts.query-repository';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { GetCommentsQueryParams } from '../../../comments/comments-api/comments-input-dto/get-comments-query-params.input-dto';
import { CommentsQueryRepository } from '../../../comments/comments-infrastructure/comments-external-query/comments-query/comments.query-repository';
import { CommentViewDto } from '../../../comments/comments-api/comments-view-dto/comments.view-dto';
import { CreateCommentInputDto } from '../../../comments/comments-api/comments-input-dto/comments.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { BasicAuthGuard } from 'src/modules/user-accounts/users-guards/basic/basic-auth.guard';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { CreatePostCommand } from '../posts-application/posts.use-cases/create-post.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { UpdatePostCommand } from '../posts-application/posts.use-cases/update-post.use-case';
import { DeletePostCommand } from '../posts-application/posts.use-cases/delete-post.use-case';
import { CreateCommentCommand } from '../../../comments/comments-application/comments.use-cases/create-comment.use-case';
import { UpdateResult } from 'mongoose';
import { CreateLikeInputDto } from 'src/modules/likes/likes-dto/create-likes.input-dto';
import { CreateLikeCommand } from 'src/modules/likes/likes-application/likes.use-cases/create-like.use-case';

@Controller('posts')
export class PostsController {
    constructor(
        private commandBus: CommandBus,
        private postsQueryRepository: PostsQueryRepository,
        private commentsQueryRepository: CommentsQueryRepository,
    ) { }

    @ApiOperation({ summary: 'Создать пост!' })
    @ApiResponse({ status: 201 })
    @UseGuards(BasicAuthGuard)
    // @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileInterceptor('image'))
    async createPostController(
        @Body() body: CreatePostInputDto,
        // @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile() image?: Multer.File | undefined,
    ): Promise<PostViewDto> {
        // console.log('PostsController: createPostController - body 😡 ', body)
        const postId = await this.commandBus.execute<CreatePostCommand, string>(
            new CreatePostCommand(body, undefined, image)
        );
        // console.log('PostsController: createPostController - postId 😡 ', postId)
        return this.postsQueryRepository.getPostByIdOrNotFoundFailQueryRepository(postId);
    }

    @ApiOperation({ summary: 'Создать комментарий определенному посту!' })
    @ApiResponse({ status: 201 })
    // @UseGuards(BasicAuthGuard)
    @UseGuards(AuthAccessGuard)
    @Post('/:postId/comments')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileInterceptor('image'))
    async createCommentForPostController(
        @Body() body: CreateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile() image?: Multer.File | undefined,
    ): Promise<CommentViewDto> {
        // console.log('PostsController: createCommentForPostController - body 😡 ', body)
        const commentId = await this.commandBus.execute<CreateCommentCommand, string>(
            new CreateCommentCommand(user.id, body, image)
        );
        return this.commentsQueryRepository.getCommentByIdOrNotFoundFailRepository(commentId);
    }
    @ApiOperation({ summary: 'Обновить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @UseGuards(AuthAccessGuard)
    @Put('/:postId/like-status')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileInterceptor('image'))
    async likePostController(
        @Param('postId') postId: string,
        @Body() body: CreateLikeInputDto,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<UpdateResult> {
        // console.log('PostsController: updatePostController - id, body 😡 ', id, body)
        return await this.commandBus.execute<CreateLikeCommand, UpdateResult>(
            new CreateLikeCommand(
                user.id,
                postId,
                body,
                'post'
            )
        );
    }

    @ApiOperation({ summary: 'Обновить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @Put('/:id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileInterceptor('image'))
    async updatePostController(
        @Param('id') id: string,
        @Body() body: UpdatePostInputDto,
        @UploadedFile() image?: Multer.File | undefined,
    ): Promise<PostViewDto> {
        // console.log('PostsController: updatePostController - id, body 😡 ', id, body)
        const postId = await this.commandBus.execute<UpdatePostCommand, string>(
            new UpdatePostCommand(id, body, image)
        );
        // console.log('PostsController: updatePostController - postId 😡 ', postId)
        const isPost = await this.postsQueryRepository.getPostByIdOrNotFoundFailQueryRepository(postId)
        // console.log('PostsController: updatePostController - isPost 😡 ', isPost)
        if (isPost.id) {
            return isPost
            // return SuccessResponse(INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST);
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST)
        }
    }

    @ApiOperation({ summary: 'Удалить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404 })
    @Delete('/:id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deletePostController(@Param('id') id: string): Promise<void> {
        // console.log('PostsController: deletePostController - id 😡 ', id)
        return await this.commandBus.execute<DeletePostCommand, void>(
            new DeletePostCommand(id)
        );
    }

    @ApiOperation({ summary: 'Получить все посты!' })
    @ApiResponse({ status: 200 })
    @Get()
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllPostsController(@Query() query: GetPostsQueryParams): Promise<PaginatedViewDto<PostViewDto[]>> {
        // console.log('PostsController: getAllPostsController - query 😡 ', query)
        const isPosts = await this.postsQueryRepository.getAllPostRepository(query);
        // console.log('PostsController: getAllPostsController - isPosts 😡 ', isPosts)
        return isPosts
    }
    @ApiOperation({ summary: 'Получить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @Get('/:id')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getPostByIdController(@Param('id') id: string): Promise<PostViewDto> {
        // console.log('PostsController: getPostByIdController - id 😡 ', id)
        return this.postsQueryRepository.getPostByIdOrNotFoundFailQueryRepository(id);
    }
    @ApiOperation({ summary: 'Получить все комментарии определенного поста!' })
    @ApiResponse({ status: 200 })
    @Get('/:postId/comments')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllCommentsController(@Query() query: GetCommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>> {
        // console.log('CommentsController: getAllCommentsController - query 😡 ', query)
        const isComments = await this.commentsQueryRepository.getAllCommentsRepository(query);
        // console.log('CommentsController: getAllCommentsController - isComments 😡 ', isComments)
        return isComments
    }
}