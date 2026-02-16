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
import { UpdateReadInputMessageDto } from '../msg-dto/msg-input-dto/update-read-input-msg.dto';
import { MessageIdParamDto } from '../msg-dto/msg-input-dto/messageIdParamDto';
import { DeleteMessageQueryDto } from '../msg-dto/msg-input-dto/deleteMessageQueryDto';
import { DeleteAllMessagesQueryDto } from '../msg-dto/msg-input-dto/deleteAllMessagesQueryDto';
import { CreateMessageCommand } from '../msg-application/msg-use-cases/create-msg.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { MessageOneViewDto } from './viev-dto-msg/msg-one.view-dto';
import { UpdateReadMsgCommand } from '../msg-application/msg-use-cases/update-read-msg.use-case';
import { DeleteAllMessageCommand } from '../msg-application/msg-use-cases/delete-all-msgs.use-case';
import { DeleteOneMessageCommand } from '../msg-application/msg-use-cases/delete-one-msgs.use-case';
import { DeleteDialogCommand } from '../../dialog/dialog-application/dialog-use-cases/delete-dialog.use-case';
import { UpdateMessageCommand } from '../msg-application/msg-use-cases/update-msg.use-case';

@ApiTags('Messages')
@Controller(SETTINGS.RouterPath.messages)
export class UsersMessagesController {
    constructor(
        private commandBus: CommandBus,
        private dialogQueryService: DialogQueryService,
        private messagesQueryService: MessageQueryService,
    ) { }

    @ApiOperation({ summary: 'Создать сообщение!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createMessageController(
        @Body() body: CreateInputMessageDto,
        @UploadedFile() attachments?: [Multer.File]
    ): Promise<MessageOneViewDto> {
        // console.log('createMessageController attachments, body: 🔥', attachments, body);
        const isCreated = await this.commandBus.execute<CreateMessageCommand, MessageOneViewDto>(
            new CreateMessageCommand(
                body,
                attachments
            )
        );
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
        const msgId = await this.commandBus.execute<UpdateMessageCommand, string>(
            new UpdateMessageCommand(
                user.id,
                body,
                file
            )
        );
        return await this.messagesQueryService.getMessageByIdOrNotFoundFailQueryService(msgId, user.id);
    }
    @ApiOperation({ summary: 'Обновить статус просмотренно в сообщении!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Put('/read')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateReadController(
        @Body() body: UpdateReadInputMessageDto,
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        // console.log('updateReadController body: 🔥', body);
        const msgId = await this.commandBus.execute<UpdateReadMsgCommand, string>(
            new UpdateReadMsgCommand(
                user.id,
                body,
            )
        );
        const isUpdateRead = await this.messagesQueryService.getMessageByIdOrNotFoundFailQueryService(msgId, user.id);
        // console.log('UsersMessagesController - RES updateReadController isUpdateRead', isUpdateRead);
        return isUpdateRead
    }
    @ApiOperation({ summary: 'Удалить всю переписку пользователя!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Delete('/all')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteAllMessagesByUserIdController(
        @Query() query: DeleteAllMessagesQueryDto,
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        // console.log('deleteAllMessagesByUserIdController senderId, receiverId - 🤪🤪🤪 - deleteOption', query.senderId, query.receiverId, query.deleteOption)
        return await this.commandBus.execute<DeleteAllMessageCommand, string>(
            new DeleteAllMessageCommand(
                query.receiverId,
                user.id,
                query.deleteOption
            )
        );
    }
    @ApiOperation({ summary: 'Удалить сообщение пользователя!' })
    @ApiResponse({ status: 204, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Delete('/:msgId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteMessagesByIdController(
        @Param() params: MessageIdParamDto,
        @Query() query: DeleteMessageQueryDto,
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        // console.log('deleteMessagesByIdController msgId, deleteOption: 🔥', params.msgId, query.deleteOption);
        return await this.commandBus.execute<DeleteOneMessageCommand, string>(
            new DeleteOneMessageCommand(
                user.id,
                params.msgId,
                query.deleteOption
            )
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
        // console.log('😳😳 deleteDialogByIdController: dialogId - ', dialogId)
        return await this.commandBus.execute<DeleteDialogCommand, string>(
            new DeleteDialogCommand(
                dialogId,
                user.id
            )
        );
        // return await this.messagesService.deleteDialogService(dialogId, user.id);
    }
    @ApiOperation({ summary: 'Получить список всех собеседников с которыми ранее была переписка!' })
    @ApiResponse({ status: 200, type: [Message] })
    @UseGuards(AuthAccessGuard)
    @Get(SETTINGS.RouterPath.interlocutors)
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllInterlocutorsController(
        @Query() query: GetDialogsQueryParams,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<PaginatedViewDto<any>> {
        // console.log('getAllInterlocutorsController user - ', user);
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
}
