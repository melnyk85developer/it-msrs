import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CommentViewDto } from './comments-view-dto/comments.view-dto';
import { UpdateCommentInputDto } from './comments-input-dto/comments-update.input-dto';
import { CommentsQueryRepository } from '../comments-infrastructure/comments-external-query/comments-query/comments.query-repository';
import { CommentsService } from '../comments-application/comments.service';
import { ValidationUpdateCommentInterceptor } from '../comments-interceptors/comment-update-validation-interceptor';
import { SuccessResponse } from 'src/shared/utils/SuccessfulResponse';
import { ErRes } from 'src/shared/utils/ErRes';
import { INTERNAL_STATUS_CODE } from 'src/shared/utils/utils';

@Controller('comments')
export class CommentsController {
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
        private commentsService: CommentsService,
    ) { }

    @ApiOperation({ summary: 'Получить комментарий по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @Get(':id')
    async getCommentsByIdController(@Param('id') id: string): Promise<CommentViewDto> {
        // console.log('CommentsController: getCommentsByIdController - id 😡 ', id)
        return this.commentsQueryRepository.getCommentByIdOrNotFoundFailRepository(id);
    }

    @ApiOperation({ summary: 'Обновить комментарий по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @UseInterceptors(ValidationUpdateCommentInterceptor)
    @Put(':commentId')
    async updateCommentController(@Param('commentId') commentId: string, @Body() body: UpdateCommentInputDto): Promise<CommentViewDto> {
        // console.log('CommentsController: updateCommentController - commentId, body 😡 ', commentId, body)
        const isUpdate = await this.commentsService.updateCommentService(commentId, body);
        // console.log('CommentsController: updateCommentController - isUpdate 😡 ', isUpdate)
        if (isUpdate) {
            return SuccessResponse(INTERNAL_STATUS_CODE.SUCCESS_UPDATED_COMMENT);
        } else {
            throw new ErRes(INTERNAL_STATUS_CODE.BAD_REQUEST)
        }
    }

    @ApiOperation({ summary: 'Удалить комментарий по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404 })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCommentController(@Param('id') id: string): Promise<void> {
        return this.commentsService.deleteCommentService(id);
    }
}