import { Body, Controller, Post, UseGuards, Get, HttpCode, HttpStatus, UseInterceptors, Redirect, Param, Put, UploadedFile, Query, Res, Delete } from '@nestjs/common';
import { AdminQueryService } from 'src/modules/admin/admin-application/admin-query-service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Multer } from 'multer';
import { HTTP_STATUSES } from 'src/core/utils/utils';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { CreatePromptAiInputDto } from '../ai-assistant-msg-dto/create-prompt-ai-assistant-input.dto';
import { CreatePromptForTerminatorCommand } from '../ai-assistant-msg-application/ai-assistant-msg.use-cases/create-prompt-for-terminator.use-case';
import { CheckAiClusterConnectionCommand } from '../../../ai-assistant.use-case/check-ai-cluster-connection-use-case';
import { ValidateFtpFileInterceptor } from 'src/modules/user-accounts/users-interceptors/fileInterceptor';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { GetDialogsAiAssistantQueryParams } from '../../ai-assistant-dialog/ai-assistant-dialog-dto/get-all-dialogs-ai-assistant-query-params.input-dto';
import { AiAssistantDialogViewDto } from '../../ai-assistant-dialog/ai-assistant-dialog-dto/ai-assistant-dialog-view.dto';
import { DialogAiAssistantQueryService } from '../../ai-assistant-dialog/ai-assistant-dialog-application/ai-assistant-dialog-query-service';
import { AiAssistantMessageOneViewDto } from './viev-dto-msg/msg-one.view-dto';
import { AiStreamInterceptor } from '../../../../interceptors/ai-stream.interceptor';
import { GetAiAssistantMessageQueryParams } from '../ai-assistant-msg-dto/get-msg-query-params.input-dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiAssistantMessage } from '../ai-assistant-msg-domain/ai-assistant-msg.entity';
import { UpdateMessageAiAssistantInputDto } from '../ai-assistant-msg-dto/update-msg-ai-assistant-input.dto';
import { UpdateMessageAiAssistantCommand } from '../ai-assistant-msg-application/ai-assistant-msg.use-cases/update-msg-ai-assistant.use-case';
import { DeleteAiAssistantAllMesgsQueryDto } from '../ai-assistant-msg-dto/delete-all-msgs-ai-assistant-query.dto';
import { DeleteAiAssistantAllMessagesCommand } from '../ai-assistant-msg-application/ai-assistant-msg.use-cases/delete-all-msgs-ai-assistant.use-case';
import { MsgAiAssistantIdParamDto } from '../ai-assistant-msg-dto/msg-ai-assistant-id-param.dto';
import { DeleteAiAssistantMsgQueryDto } from '../ai-assistant-msg-dto/delete-msg-ai-assistant-query-dto';
import { DeleteAiAssistantOneMessageCommand } from '../ai-assistant-msg-application/ai-assistant-msg.use-cases/delete-one-msg-ai-assistant.use-case';
import { DeleteAiAssistantDialogCommand } from '../../ai-assistant-dialog/ai-assistant-dialog-application/ai-assistant-dialog-use-cases/delete-ai-assistant-dialog.use-case';
import { MessageAiAssistantQueryService } from '../ai-assistant-msg-application/msg-ai-assistant-query-service';
import { GetAllProvidersModelsQuery } from '../../../ai-assistant.use-case/get-all-providers-models.query.use-case';
import { CreateAllRulesAiAssistantInputDto } from '../../../ai-assistant-rules/ai-assistant-rules-dto/create-all-rules-for-ai-assistants-input.dto';
import { UpdateRulesAiAssistantDomainDto } from '../../../ai-assistant-rules/ai-assistant-rules-dto/update-all-rules-for-ai-assistants-domain.dto';
import { UpdateRulesAiAssistantInputDto } from '../../../ai-assistant-rules/ai-assistant-rules-dto/update-all-rules-for-ai-assistants-input.dto';
import { UpdateRulesAiAssistantCommand } from '../../../ai-assistant-rules/ai-assistant-rules-application/update-rules-for-all-terminators.use-case';
import { DeleteAllRulesForTerminatorsCommand } from '../../../ai-assistant-rules/ai-assistant-rules-application/delete-rules-for-all-terminators.use-case';
import { GetAllRulesForTerminatorsQuery } from '../../../ai-assistant-rules/ai-assistant-rules-application/get-rules-for-terminators-query.use-case';
import { RulesAiAssistant } from '../../../ai-assistant-rules/ai-assistant-rules-damain/ai-assistant-global-context.entity';
import { UpdateDesignatedProviderForAiAssistantCommand } from '../../../ai-assistant.use-case/update-designated-provider-for-terminator.use-case';
import { UpdateProviderForAiAssistantInputDto } from '../../../ai-assistant-dto/update-provider-for-ai-assistants-input.dto';
import { ContinueInterceptor } from '../../../../interceptors/continueInterceptor';
import { CreateContinuePromptAiInputDto } from '../ai-assistant-msg-dto/create-continue-prompt-ai-assistant-input.dto';
import { CreateAllRulesForTerminatorsCommand } from '../../../ai-assistant-rules/ai-assistant-rules-application/create-rules-for-all-terminators.use-case';
import { LoadEmbeddingDataCommand } from '../../../ai-assistant-embedding/ai-assistant-embedding-application/load-embedding-data.use-case';
import { FilesService } from 'src/modules/files/files.service';
import { EmbeddingRepository } from '../../../ai-assistant-embedding/ai-assistant-embedding-infrastrucrure/embedding.repository';
import { DeleteKnowledgeSourceCommand } from '../../../ai-assistant-embedding/ai-assistant-embedding-application/deleteKnowledgeSourceUseCase';
import { FileParserService } from 'src/modules/files/fileParserService';
import { DialogAiAssistantType, GetDialogAiAssistantQuery } from '../../ai-assistant-dialog/ai-assistant-dialog-application/get-dialog-ai-assistant.query.use-case';

// @Roles('ADMIN')
@Controller('/admin')
export class AiAssistantController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly filesService: FilesService,
        private readonly fileParserService: FileParserService,
        private readonly embeddingRepository: EmbeddingRepository,
        private readonly adminQueryService: AdminQueryService,
        private readonly messageAiAssistantQueryService: MessageAiAssistantQueryService,
        private readonly dialogAiAssistantQueryService: DialogAiAssistantQueryService,
    ) { }
    @Post('/ai-assistant/knowledge/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadKnowledgeController(
        @UploadedFile() file: Multer.File,
        @Body('node') node: string,
        @Body('assistantId') assistantId: string
    ) {
        // 1. Парсим текст из файла (любого формата)
        const content = await this.fileParserService.parseFile(file);

        // 2. Сохраняем файл на диск
        const savedPath = await this.filesService.createKnowledgeFile(file);

        // 3. Нарезаем на эмбеддинги
        return this.commandBus.execute(new LoadEmbeddingDataCommand({
            assistantId: assistantId || 'global',
            sourceType: 'file',
            sourceId: savedPath,
            content: content,
            node: node
        }));
    }

    @Delete('/ai-assistant/knowledge/:sourceId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteKnowledgeController(@Param('sourceId') sourceId: string) {
        // Здесь sourceId прилетит как "knowledge/filename.ts" (закодированный в URL)
        return this.commandBus.execute(new DeleteKnowledgeSourceCommand(decodeURIComponent(sourceId)));
    }
    @Get('/ai-assistant/knowledge/sources')
    async getKnowledgeSources() {
        // Вызываем агрегацию из репозитория, которая вернет только уникальные источники
        return this.embeddingRepository.getAllUniqueSources();
    }

    // @UseGuards(AuthAccessGuard)
    @Post('/ai-assistant/rules-for-terminators')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createRulesForTerminatorsController(
        @Body() dto: CreateAllRulesAiAssistantInputDto
    ): Promise<any> {
        // console.log('createRulesForTerminatorsController: - 😡 dto', dto)
        const res = await this.commandBus.execute(new CreateAllRulesForTerminatorsCommand(dto));
        // console.log('createRulesForTerminatorsController: res - ', res)
        return res
    }
    @UseGuards(AuthAccessGuard)
    @Put('/ai-assistant/rules-for-terminators')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateRulesForTerminatorsController(@Body() dto: UpdateRulesAiAssistantInputDto): Promise<any> {
        // console.log('updateRulesForTerminatorsController: - 😡 dto', dto)
        const res = await this.commandBus.execute(new UpdateRulesAiAssistantCommand(dto));
        // console.log('updateRulesForTerminatorsController: res - ', res)
        return res
    }
    @UseGuards(AuthAccessGuard)
    @Delete('/ai-assistant/rules-for-terminators')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteRulesForTerminatorsController(): Promise<any> {
        // console.log('deleteRulesForTerminatorsController: - 😡')
        const res = await this.commandBus.execute(new DeleteAllRulesForTerminatorsCommand());
        // console.log('deleteRulesForTerminatorsController: res - ', res)
        return res
    }
    @UseGuards(AuthAccessGuard)
    @Put('/ai-assistant/designated-provider')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateDesignatedProviderAndModelController(
        @Body() dto: UpdateProviderForAiAssistantInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<any> {
        // console.log('updateRulesForTerminatorsController: - 😡 dto', dto)
        const res = await this.commandBus.execute(new UpdateDesignatedProviderForAiAssistantCommand(
            user.id,
            dto
        ));
        // console.log('updateRulesForTerminatorsController: res - ', res)
        return res
    }
    // @UseGuards(AuthAccessGuard)
    @Post('/ai-assistant/test-connection')
    async testConnectionController() {
        console.log('testConnectionController: - 😡')
        return await this.commandBus.execute(new CheckAiClusterConnectionCommand());
    }
    @Post('/v1/chat/completions')
    @UseInterceptors(ContinueInterceptor)
    // @UseInterceptors(AiStreamInterceptor)
    async continueProxyController(
        @Body() dto: any,
    ) {
        // const userMessages = body.messages?.filter((m: any) => m.role !== 'system') || [];
        // const lastMessage = userMessages[userMessages.length - 1]?.content || '';

        // console.log('continueProxyController: - 😡 dto', dto)

        return this.commandBus.execute(
            new CreatePromptForTerminatorCommand(dto)
        );
    }
    @Post('/ai-assistant/orchestrate')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(
        // ContinueInterceptor,
        AiStreamInterceptor
    )
    async createPromptForTerminatorController(
        @Body() dto: CreatePromptAiInputDto,
        @UploadedFile() image: Multer.File
    ): Promise<{ userPrompt: AiAssistantMessageOneViewDto, assistantResponse: AiAssistantMessageOneViewDto }> {
        // console.log('createPromptForTerminatorController: - 😡 dto', dto)
        const res = await this.commandBus.execute(new CreatePromptForTerminatorCommand(dto));
        // console.log('createPromptForTerminatorController: res - ', res)
        return res
    }
    @ApiOperation({ summary: 'Обновить сообщение!' })
    @ApiResponse({ status: 200, type: [AiAssistantMessage] })
    @UseGuards(AuthAccessGuard)
    @Put('/ai-assistant/prompt')
    @HttpCode(HTTP_STATUSES.OK_200)
    @UseInterceptors(FileInterceptor('file'))
    async updateAiAssistantMessageController(
        @Body() body: UpdateMessageAiAssistantInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile() file?: [Multer.File]
    ) {
        // console.log('updateAiAssistantMessageController file, body: 🔥', file, body);
        const msgId = await this.commandBus.execute<UpdateMessageAiAssistantCommand, string>(
            new UpdateMessageAiAssistantCommand(
                user.id,
                body,
                file
            )
        );
        return await this.messageAiAssistantQueryService.getMessageByIdOrNotFoundFailQueryService(msgId, user.id);
    }
    @ApiOperation({ summary: 'Удалить сообщение пользователя!' })
    @ApiResponse({ status: 204, type: [AiAssistantMessage] })
    @UseGuards(AuthAccessGuard)
    @Delete('/ai-assistant/prompt/:msgId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteAiAssistantMessageByIdController(
        @Param() params: MsgAiAssistantIdParamDto,
        @Query() query: DeleteAiAssistantMsgQueryDto,
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        // console.log('deleteAiAssistantMessageByIdController msgId, deleteOption: 🔥', params.msgId, query.deleteOption);
        return await this.commandBus.execute<DeleteAiAssistantOneMessageCommand, string>(
            new DeleteAiAssistantOneMessageCommand(
                user.id,
                params.msgId,
                query.deleteOption
            )
        );
    }
    @ApiOperation({ summary: 'Удалить всю переписку пользователя!' })
    @ApiResponse({ status: 200, type: [AiAssistantMessage] })
    @UseGuards(AuthAccessGuard)
    @Delete('/ai-assistant/prompts/all')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteAiAssistantAllMsgsByUserIdController(
        @Query() query: DeleteAiAssistantAllMesgsQueryDto,
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        // console.log('deleteAiAssistantAllMsgsByUserIdController senderId, receiverId - 🤪🤪🤪 - deleteOption', query.senderId, query.receiverId, query.deleteOption)
        return await this.commandBus.execute<DeleteAiAssistantAllMessagesCommand, string>(
            new DeleteAiAssistantAllMessagesCommand(
                query.receiverId,
                user.id,
                query.deleteOption
            )
        );
    }

    @ApiOperation({ summary: 'Удалить сообщение пользователя!' })
    @ApiResponse({ status: 200, type: [AiAssistantMessage] })
    @UseGuards(AuthAccessGuard)
    @Delete('/ai-assistant/dialog/:dialogId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteAiAssistantDialogByIdController(
        @Param('dialogId') dialogId: string,
        @ExtractUserFromRequest() user: UserContextDto
    ) {
        // console.log('😳😳 deleteAiAssistantDialogByIdController: dialogId - ', dialogId)
        return await this.commandBus.execute<DeleteAiAssistantDialogCommand, string>(
            new DeleteAiAssistantDialogCommand(
                dialogId,
                user.id
            )
        );
        // return await this.messagesService.deleteDialogService(dialogId, user.id);
    }
    // @UseGuards(AuthAccessGuard)
    @Get('/ai-assistant/system-prompts')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getRulesForTerminatorsController(): Promise<RulesAiAssistant[]> {
        // console.log('getRulesForTerminatorsController: - 😡')
        const res = await this.queryBus.execute(new GetAllRulesForTerminatorsQuery());
        // console.log('getRulesForTerminatorsController: res - ', res)
        return res
    }
    // @Roles('ADMIN')
    @UseGuards(AuthAccessGuard)
    @Get('/ai-plenum/all-terminators')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllAiProvidersController() {
        console.log('getAllAiProvidersController: all-terminators')
        return this.queryBus.execute(new GetAllProvidersModelsQuery());
    }
    // @Roles('ADMIN')
    @UseGuards(AuthAccessGuard)
    @Get('/ai-interlocutors')
    async getAIAssistantsInterlocutorsController(
        @Query() query: GetDialogsAiAssistantQueryParams,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<PaginatedViewDto<AiAssistantDialogViewDto[]>> {
        // console.log('getAIAssistantsInterlocutorsController: ')
        // console.log('getAllInterlocutorsController user - ', user);
        const interlocutors = await this.dialogAiAssistantQueryService.getAIAssistantsInterlocutorsQueryService(
            query,
            user.id
        );
        // console.log('getAllInterlocutorsController interlocutors - ', interlocutors);
        return interlocutors
    }
    // @Roles('ADMIN')
    @UseGuards(AuthAccessGuard)
    @Get('/ai-messages/dialog/:receiverId')
    async getDialogAIAssistantController(
        @Param('receiverId') receiverId: string,
        @Query() query: GetAiAssistantMessageQueryParams,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<PaginatedViewDto<DialogAiAssistantType> | null> {
        // console.log('getDialogAIAssistantController: receiverId', receiverId)
        const dialog = await this.queryBus.execute(
            new GetDialogAiAssistantQuery(
                user.id,
                receiverId,
                query
            )
        );
        console.log('getDialogAIAssistantController: RES dialog', dialog)
        return dialog
    }
    // @Roles('ADMIN')
    @UseGuards(AuthAccessGuard)
    @Get('/static/ftp/img/:folder')
    async getFtpFilesController(@Param('folder') folder: string) {
        console.log('getFtpFilesController: folder', folder)
        return await this.adminQueryService.getFtpFilesByFolder(folder)
    }
    // @Roles('ADMIN')
    @Get('/static/ftp/:folder')
    @UseGuards(AuthAccessGuard)
    @UseInterceptors(ValidateFtpFileInterceptor)
    async getFtpFileController(
        @Param('folder') folder: string,
        @Query('fileName') fileName: string,
        @Res() res: any // Добавь @Res()
    ) {
        // console.log('getFtpFileController: folder, fileName 😡', folder, fileName)
        const resFileName = await this.adminQueryService.getMimeType(fileName);
        const resFilePath = await this.adminQueryService.getFtpFileByFolderAndName(folder, fileName);
        // console.log('getFtpFileController: folder, resFileName, resFilePath 😡', folder, resFileName, resFilePath)

        res.type(resFileName);
        res.setHeader(
            'Content-Disposition',
            `inline; filename*=UTF-8''${encodeURIComponent(resFileName)}`
        );

        // ВАЖНО: при стриминге файлов ничего больше не возвращаем!
        return res.sendFile(resFilePath);

        // return {
        //     resFileName,
        //     resFilePath
        // }
    }
}