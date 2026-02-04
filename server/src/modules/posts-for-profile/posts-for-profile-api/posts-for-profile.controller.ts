import { Body, Controller, Post, UseGuards, Get, HttpCode, HttpStatus, UseInterceptors, Redirect, Param, Put, UploadedFile, Query, Delete } from '@nestjs/common';
import { AuthAccessGuard } from '../../user-accounts/users-guards/bearer/jwt-auth.guard';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PostForProfileService } from '../posts-application/post-for-profile-service';
import { ExtractUserFromRequest } from '../../user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../user-accounts/users-guards/dto/user-context.dto';
import { PostsForProfileQueryRepository } from '../posts-infrastructure/posts.query-repository';
import { PostForProfileViewDto } from './posts-for-profile-view-dto/posts-for-profile.view-dto';
import { CreatePostForProfileInputDto } from './posts-for-profile-input-dto/posts.input-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { GetPostForProfileQueryParams } from './posts-for-profile-input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UpdatePostForProfileDto, UpdatePostForProfileInputDto } from './posts-for-profile-input-dto/posts-update.input-dto';

@Controller('/posts-for-profile')
export class PostForProfileController {
    constructor(
        private postForProfileService: PostForProfileService,
        private postForProfileRepository: PostsForProfileQueryRepository,
    ) { }
    @ApiOperation({ summary: 'Создать пост!' })
    @ApiResponse({ status: 201 })
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileInterceptor('image'))
    async postForProfileController(
        @ExtractUserFromRequest() user: UserContextDto,
        @Body() body: CreatePostForProfileInputDto,
        @UploadedFile() image: Multer.File
    ): Promise<PostForProfileViewDto> {
        // console.log('PostForProfileController: createPostController - image 😡 ', image)
        // console.log('PostForProfileController: createPostController - body 😡 ', body)
        const postId = await this.postForProfileService.createPostForProfileService(
            user.id,
            image,
            body
        );
        // console.log('PostForProfileController: createPostController - postId 😡 ', postId)
        return this.postForProfileRepository.getPostByIdOrNotFoundFailQueryRepository(postId);
    }

    // @ApiOperation({ summary: 'Создать комментарий определенному посту!' })
    // @ApiResponse({ status: 201 })
    // // @UseGuards(BasicAuthGuard)
    // @UseGuards(AuthAccessGuard)
    // @Post('/:postId/comments')
    // @HttpCode(HTTP_STATUSES.CREATED_201)
    // async createCommentForPostController(@Body() body: CreateCommentInputDto): Promise<CommentViewDto> {
    //     // console.log('PostsController: createCommentForPostController - body 😡 ', body)
    //     const commentId = await this.commentsService.createCommentService(body);
    //     return this.commentsQueryRepository.getCommentByIdOrNotFoundFailRepository(commentId);
    // }

    @ApiOperation({ summary: 'Обновить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @UseGuards(AuthAccessGuard)
    @Put('/:postId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileInterceptor('image'))
    async updatePostForProfileController(
        @Param('postId') postId: string,
        @Body() body: UpdatePostForProfileInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile() image: Multer.File
    ): Promise<PostForProfileViewDto> {

        // console.log('PostForProfileController: updatePostForProfileController - postId 😡 ', postId)
        // console.log('PostForProfileController: updatePostForProfileController - body 😡 ', body)

        const isPostId = await this.postForProfileService.updatePostForProfileService(
            postId,
            user.id,
            image,
            body
        );
        // image ? image : body.image,
        // console.log('PostForProfileController: updatePostForProfileController - isPostId 😡 ', isPostId)
        return this.postForProfileRepository.getPostByIdOrNotFoundFailQueryRepository(isPostId);
    }

    @ApiOperation({ summary: 'Удалить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404 })
    @UseGuards(AuthAccessGuard)
    @Delete('/:postId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deletePostForProfileController(
        @Param('postId') postId: string,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<void> {
        console.log('PostsController: deletePostController - postId 😡 ', postId)
        return this.postForProfileService.deletePostForProfileService(postId, user.id);
    }

    @ApiOperation({ summary: 'Получить все посты!' })
    @ApiResponse({ status: 200 })
    @UseGuards(AuthAccessGuard)
    @Get()
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllPostForProfileController(@Query() query: GetPostForProfileQueryParams): Promise<PaginatedViewDto<PostForProfileViewDto[]>> {
        // console.log('PostsController: getAllPostsController - query 😡 ', query)
        const isPosts = await this.postForProfileRepository.getAllPostsForProfileRepository(query);
        // console.log('PostsController: getAllPostsController - isPosts 😡 ', isPosts)
        return isPosts
    }
    @ApiOperation({ summary: 'Получить пост по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @Get('/:postId')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getPostByIdController(@Param('postId') postId: string): Promise<PostForProfileViewDto> {
        return this.postForProfileRepository.getPostByIdOrNotFoundFailQueryRepository(postId);
    }
    // @ApiOperation({ summary: 'Получить все комментарии определенного поста!' })
    // @ApiResponse({ status: 200 })
    // @Get('/:postId/comments')
    // @HttpCode(HTTP_STATUSES.OK_200)
    // async getAllCommentsController(@Query() query: GetCommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>> {
    //     // console.log('CommentsController: getAllCommentsController - query 😡 ', query)
    //     const isComments = await this.commentsQueryRepository.getAllCommentsRepository(query);
    //     // console.log('CommentsController: getAllCommentsController - isComments 😡 ', isComments)
    //     return isComments
    // }
}