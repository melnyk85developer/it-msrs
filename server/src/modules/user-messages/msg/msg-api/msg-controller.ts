import { Body, Request, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe, Req, UploadedFiles, Query, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';
import { SETTINGS } from 'src/core/settings';
import { Message } from '../msg-domain/msg-entity';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMessageDto } from '../msg-dto/create-msg.dto';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { UsersQueryRepository } from 'src/modules/user-accounts/users-infrastructure/users.query-repository';
import { DialogService } from '../../dialog/dialog-application/dialog-service';
import { MessageService } from '../msg-application/msg-service';
import { MessageQueryRepository } from '../msg-infrastructure/msg-query.repository';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { GetMessageQueryParams } from '../msg-dto/msg-input-dto/get-msg-query-params.input-dto';
import { DialogsAllViewDto } from './viev-dto-msg/dialogs-all.view-dto';
import { GetDialogsQueryParams } from '../msg-dto/msg-input-dto/get-all-dialogs-query-params.input-dto';
import { DialogQueryRepository } from '../../dialog/dialog-infrastructure/dialog-query.repository';
import { DialogQueryService } from '../../dialog/dialog-application/dialog-query-service';
import { CreateInputMessageDto } from '../msg-dto/msg-input-dto/create-input-msg.dto';
import { InterlocutorViewDto } from './viev-dto-msg/interlocutorViewDto';
import { UpdateInputMessageDto } from '../msg-dto/msg-input-dto/update-input-msg.dto';
import { MessageQueryService } from '../msg-application/msg-query-service';

@ApiTags('Messages')
@Controller(SETTINGS.RouterPath.messages)
export class UsersMessagesController {
    constructor(
        private dialogService: DialogService,
        private dialogQueryService: DialogQueryService,
        private messagesService: MessageService,
        private messagesQueryService: MessageQueryService,
        private usersQueryRepository: UsersQueryRepository,
        // private messageQueryRepository: MessageQueryRepository,
    ) { }

    @ApiOperation({ summary: 'Получить список всех собеседников с которыми ранее была переписка!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Get(SETTINGS.RouterPath.interlocutors)
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllInterlocutorsController(
        @Query() query: GetDialogsQueryParams,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<PaginatedViewDto<any>> {
        console.log('getAllInterlocutorsController user - ', user);
        const interlocutors = await this.dialogQueryService.getAllInterlocutorsByUserIdQueryService(
            query,
            user.id
        );
        return interlocutors
    }
    @ApiOperation({ summary: 'Получить переписку пользователя с его собеседником по id!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Get('/dialog/:dialogId')
    async getDialogAndMSGController(
        @Param('dialogId') dialogId: string,
        @Query() query: GetMessageQueryParams,
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        // console.log('getDialogAndMSGController: - query', query)
        return await this.dialogQueryService.getDialogAndMSGQueryService(
            user.id,
            dialogId,
            query.receiverId
        )
    }
    @ApiOperation({ summary: 'Создать сообщение!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    @HttpCode(HTTP_STATUSES.OK_200)
    async createMessageController(
        @Body() body: CreateInputMessageDto,
        @UploadedFile() file?: [Multer.File]
    ) {
        // console.log('createMessageController file, body: 🔥', file, body);
        const isCreated = await this.messagesService.createMessageService(
            body,
            file
        )
        return isCreated
    }
    @ApiOperation({ summary: 'Обновить сообщение!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Put()
    @HttpCode(HTTP_STATUSES.OK_200)
    @UseInterceptors(FileInterceptor('file'))
    async updateMessageController(
        @Body() body: UpdateInputMessageDto,
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile() file?: [Multer.File]
    ) {
        // console.log('updateMessageController file, body: 🔥', file, body);
        const msgId = await this.messagesService.updateMessagesServices(body, file)
        return await this.messagesQueryService.getMessageByIdOrNotFoundFailQueryService(msgId, user.id);
    }
    @ApiOperation({ summary: 'Обновить статус просмотренно в сообщении!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Put('/read')
    async updateReadController(
        @Body() body: { msgId: string, read: boolean },
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        // console.log('updateReadController body: 🔥', body);
        const msgId = await this.messagesService.updateReadServices(body)
        return await this.messagesQueryService.getMessageByIdOrNotFoundFailQueryService(msgId, user.id);
    }
    @ApiOperation({ summary: 'Удалить сообщение пользователя!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Delete('/:msgId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteMessagesByIdController(
        @Param('msgId') msgId: string,
        @Query('deleteOption') deleteOption: string,
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        return await this.messagesService.deleteMessageByMsgIdServices(
            user.id,
            msgId,
            deleteOption
        );
    }
    @ApiOperation({ summary: 'Удалить всю переписку пользователя!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Delete('/all')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteAllMessagesByUserIdController(
        @Query('senderId') senderId: string,
        @Query('receiverId') receiverId: string,
        @Query('deleteOption') deleteOption: string,
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        console.log('deleteAllMessagesByUserIdController senderId, receiverId - 🤪🤪🤪 - deleteOption', senderId, receiverId, deleteOption)
        return await this.messagesService.deleteAllMessagesServices(
            receiverId,
            user.id,
            deleteOption
        );
    }
    @ApiOperation({ summary: 'Удалить сообщение пользователя!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Delete('/dialog/:dialogId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteDialogByIdController(
        @Param('dialogId') dialogId: string,
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        console.log('😳😳 deleteDialogByIdController: dialogId - ', dialogId)
        return await this.messagesService.deleteDialogService(dialogId, user.id);
    }
}
