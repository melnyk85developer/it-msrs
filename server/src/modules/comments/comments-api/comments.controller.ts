import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CommentViewDto } from './comments-view-dto/comments.view-dto';
import { UpdateCommentInputDto } from './comments-input-dto/comments-update.input-dto';
import { CommentsQueryRepository } from '../comments-infrastructure/comments.query-repository';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteCommentCommand } from '../comments-application/comments.use-cases/delete-comment.use-case';
import { UpdateCommentCommand } from '../comments-application/comments.use-cases/update-comment.use-case';
import { CommentQueryService } from '../comments-application/comments-query-service';
import { BasicAuthGuard } from 'src/modules/user-accounts/users-guards/basic/basic-auth.guard';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateLikeInputDto } from 'src/modules/likes/likes-dto/like-update-input.dto';
import { UpdateResult } from 'mongoose';
import { UpdateLikeCommand } from 'src/modules/likes/likes-application/likes.use-cases/update-like.use-case';
import { JwtOptionalAuthGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-if-exists-from-request.decorator';

@Controller('comments')
export class CommentsController {
    constructor(
        private commandBus: CommandBus,
        private commentQueryService: CommentQueryService
    ) { }

    @ApiOperation({ summary: 'Обновить комментарий по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    // @UseGuards(BasicAuthGuard)
    @UseGuards(JwtOptionalAuthGuard)
    @Put('/:commentId/like-status')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileInterceptor('image'))
    async likeCommentsController(
        @Param('commentId') commentId: string,
        @Body() dto: UpdateLikeInputDto,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<UpdateResult> {
        console.log('PostsController: likePostController - commentId, dto.likeStatus 😡 ', commentId, dto.likeStatus)
        return await this.commandBus.execute<UpdateLikeCommand, UpdateResult>(
            new UpdateLikeCommand(
                user.id,
                commentId,
                dto.likeStatus,
                'comment'
            )
        );
    }
    @ApiOperation({ summary: 'Обновить комментарий по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @UseGuards(AuthAccessGuard)
    @Put('/:commentId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateCommentController(
        @Param('commentId') commentId: string,
        @Body() dto: UpdateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<string> {
        // console.log('CommentsController: updateCommentController - commentId, body 😡 REQ', commentId, body)
        const isUpdate = await this.commandBus.execute<UpdateCommentCommand, string>(
            new UpdateCommentCommand(commentId, user.id, dto.content)
        );
        // console.log('CommentsController: updateCommentController - isUpdate 😡 RES', isUpdate)
        return isUpdate
    }
    @ApiOperation({ summary: 'Удалить комментарий по id.' })
    @ApiParam({ name: 'commentId' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404 })
    // @UseGuards(BasicAuthGuard)
    @UseGuards(AuthAccessGuard)
    @Delete('/:commentId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteCommentController(
        @Param('commentId') commentId: string,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<void> {
        // console.log('CommentsController: getCommentsByIdController - id 😡 ', commentId)
        return await this.commandBus.execute<DeleteCommentCommand, void>(
            new DeleteCommentCommand(commentId, user?.id)
        );
    }
    @ApiOperation({ summary: 'Получить комментарий по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    // @UseGuards(BasicAuthGuard)
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/:id')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getCommentsByIdController(
        @Param('id') id: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ): Promise<CommentViewDto> {
        // console.log('CommentsController: getCommentsByIdController - id 😡 REQ', id)
        return this.commentQueryService.getCommentQueryService(id, user?.id);
    }
}