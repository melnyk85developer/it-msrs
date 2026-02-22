import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetPostsQueryParams } from './posts-input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from './posts-view-dto/posts.view-dto';
import { CreatePostInputDto } from './posts-input-dto/posts.input-dto';
import { UpdatePostInputDto } from './posts-input-dto/posts-update.input-dto';
import { PostsQueryRepository } from '../posts-infrastructure/posts.query-repository';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { GetCommentsQueryParams } from '../../../comments/comments-api/comments-input-dto/get-comments-query-params.input-dto';
import { CommentsQueryRepository } from '../../../comments/comments-infrastructure/comments.query-repository';
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
import { UpdateLikeCommand } from 'src/modules/likes/likes-application/likes.use-cases/update-like.use-case';
import { UpdateLikeInputDto } from 'src/modules/likes/likes-dto/like-update-input.dto';
import { ExtractUserIfExistsFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { PostQueryService } from '../posts-application/post-query-service';
import { CommentQueryService } from 'src/modules/comments/comments-application/comments-query-service';
import { JwtOptionalAuthGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-optional-auth.guard';

@Controller('posts')
export class PostsController {
    constructor(
        private commandBus: CommandBus,
        private postQueryService: PostQueryService,
        private commentQueryService: CommentQueryService,
    ) { }

    @ApiOperation({ summary: 'Создать пост!' })
    @ApiResponse({ status: 201 })
    // @UseGuards(BasicAuthGuard)
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileInterceptor('image'))
    async createPostController(
        @Body() body: CreatePostInputDto,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
        @UploadedFile() image?: Multer.File | undefined,
    ): Promise<PostViewDto> {
        // console.log('PostsController: createPostController - body 😡 ', body)
        const postId = await this.commandBus.execute<CreatePostCommand, string>(
            new CreatePostCommand(body, undefined, image)
        );
        console.log('PostsController: createPostController - postId 😡 RES', postId)
        return this.postQueryService.getPostQueryService(postId, user?.id);
    }

    @ApiOperation({ summary: 'Создать комментарий определенному посту!' })
    @ApiResponse({ status: 201 })
    @UseGuards(AuthAccessGuard)
    @Post('/:postId/comments')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileInterceptor('image'))
    async createCommentForPostController(
        @Param('postId') postId: string,
        @Body() dto: CreateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile() image?: Multer.File | undefined,
    ): Promise<CommentViewDto> {
        console.log('PostsController: createCommentForPostController - dto 😡 ', dto)
        const commentId = await this.commandBus.execute<CreateCommentCommand, string>(
            new CreateCommentCommand(
                user.id,
                postId,
                dto.content,
                image
            )
        );
        console.log('PostsController: createCommentForPostController - RES 😡 ', commentId)
        return this.commentQueryService.getCommentQueryService(
            commentId,
            user.id
        );
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
        @Body() dto: UpdateLikeInputDto,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<UpdateResult> {
        console.log('PostsController: likePostController - postId, dto.likeStatus 😡 ', postId, dto.likeStatus)
        return await this.commandBus.execute<UpdateLikeCommand, UpdateResult>(
            new UpdateLikeCommand(
                user.id,
                postId,
                dto.likeStatus,
                'post'
            )
        );
    }

    @ApiOperation({ summary: 'Обновить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    // @UseGuards(BasicAuthGuard)
    @UseGuards(AuthAccessGuard)
    @Put('/:id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileInterceptor('image'))
    async updatePostController(
        @Param('id') id: string,
        @Body() body: UpdatePostInputDto,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
        @UploadedFile() image?: Multer.File | undefined,
    ): Promise<PostViewDto> {
        console.log('PostsController: updatePostController - id, body 😡 REQ', id, body)
        const postId = await this.commandBus.execute<UpdatePostCommand, string>(
            new UpdatePostCommand(id, body, image)
        );
        console.log('PostsController: updatePostController - postId 😡 RES', postId)
        const isPost = await this.postQueryService.getPostQueryService(postId, user.id)
        console.log('PostsController: updatePostController - isPost 😡 RES', isPost)
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
    // @UseGuards(BasicAuthGuard)
    @UseGuards(AuthAccessGuard)
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
    @UseGuards(JwtOptionalAuthGuard)
    @Get()
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllPostsController(
        @Query() query: GetPostsQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ): Promise<PaginatedViewDto<PostViewDto[]>> {
        // console.log('PostsController: getAllPostsController - query 😡 ', query)
        const isPosts = await this.postQueryService.getAllPostsQueryService(user?.id, query);
        // console.log('PostsController: getAllPostsController - isPosts 😡 RES', isPosts)
        return isPosts
    }
    @ApiOperation({ summary: 'Получить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/:id')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getPostByIdController(
        @Param('id') id: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ): Promise<PostViewDto> {
        console.log('PostsController: getPostByIdController - id 😡 ', id)
        return this.postQueryService.getPostQueryService(id, user?.id);
    }
    @ApiOperation({ summary: 'Получить все комментарии определенного поста!' })
    @ApiResponse({ status: 200 })
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/:postId/comments')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllCommentsController(
        @Param('postId') postId: string,
        @Query() query: GetCommentsQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ): Promise<PaginatedViewDto<CommentViewDto[]>> {
        // console.log('CommentsController: getAllCommentsController - query 😡 ', query)
        const isComments = await this.commentQueryService.getAllCommentsQueryService(user?.id, query, postId);
        console.log('CommentsController: getAllCommentsController - isComments 😡 RES', isComments)
        return isComments
    }
}