import { Body, Controller, Post, UseGuards, Get, HttpCode, HttpStatus, UseInterceptors, Redirect, Param, Put, UploadedFile, Query, Res } from '@nestjs/common';
import { AdminQueryService } from 'src/modules/admin/admin-application/admin-query-service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { HTTP_STATUSES } from 'src/core/utils/utils';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { CreatePromptAiInputDto } from '../ai-assistant-dto/create-prompt-ai-assistant-input.dto';
import { CreatePromptForTerminatorCommand } from '../ai-assistant-application/ai-assistant-msg-use-case/create-prompt-for-terminator.use-case';
import { CheckAiClusterConnectionCommand } from '../ai-assistant-application/ai-assistant-msg-use-case/check-ai-cluster-connection-use-case';
import { ValidateFtpFileInterceptor } from 'src/modules/user-accounts/users-interceptors/fileInterceptor';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { GetDialogsAiAssistantQueryParams } from '../../ai-assistant-dialog/ai-assistant-dialog-dto/get-all-dialogs-ai-assistant-query-params.input-dto';
import { AiAssistantDialogViewDto } from './viev-dto-msg/ai-assistant-dialog-view.dto';
import { DialogAiAssistantQueryService, DialogAiAssistantType } from '../../ai-assistant-dialog/ai-assistant-dialog-application/ai-assistant-dialog-query-service';
import { AiAssistantMessageOneViewDto } from './viev-dto-msg/msg-one.view-dto';
import { GetAiModelsQuery } from '../ai-assistant-application/get-ai-models.query-service';
import { GetGoogleModelsQuery } from '../ai-assistant-application/get-google-models.query.service';
import { AiStreamInterceptor } from '../../interceptors/ai-stream.interceptor';

// @Roles('ADMIN')
@Controller('admin')
export class AiAssistantController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private adminQueryService: AdminQueryService,
        private dialogAiAssistantQueryService: DialogAiAssistantQueryService,
    ) { }

    @Get('/ai-plenum/models/google')
    async getGoogleModels() {
        return this.queryBus.execute(new GetGoogleModelsQuery());
    }
    // @UseGuards(AuthAccessGuard)
    @Get('/ai-plenum/models')
    async getAiModelsController() {
        return await this.queryBus.execute(new GetAiModelsQuery());
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
        return interlocutors
    }
    // @Roles('ADMIN')
    @UseGuards(AuthAccessGuard)
    @Get('/ai-messages/dialog/:receiverId')
    async getDialogAIAssistantController(
        @Param('receiverId') receiverId: string,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<DialogAiAssistantType | []> {
        // console.log('getDialogAIAssistantController: receiverId', receiverId)
        const dialog = await this.dialogAiAssistantQueryService.getOneDialogBySenderIdOrReceiverIdQueryService(
            user.id,
            receiverId
        );
        // console.log('getDialogAIAssistantController: RES dialog', dialog)
        return dialog
    }
    @Post('/ai-assistant/orchestrate')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    // @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(AiStreamInterceptor)
    async createPromptForTerminatorController(
        @Body() dto: CreatePromptAiInputDto,
        // @UploadedFile() image: Multer.File
    ): Promise<{ userPrompt: AiAssistantMessageOneViewDto, assistantResponse: AiAssistantMessageOneViewDto }> {
        console.log('createPromptForTerminatorController: - 😡 dto', dto)
        const res = await this.commandBus.execute(new CreatePromptForTerminatorCommand(dto));
        console.log('createPromptForTerminatorController: res - ', res)
        return res
    }

    // @UseGuards(AuthAccessGuard)
    @Post('/ai-assistant/test-connection')
    async testConnectionController() {
        console.log('testConnectionController: - 😡')
        return await this.commandBus.execute(new CheckAiClusterConnectionCommand());
    }
    @Post('v1/chat/completions')
    @UseInterceptors(AiStreamInterceptor)
    async continueProxy(@Body() body: any) {
        const userMessages = body.messages?.filter((m: any) => m.role !== 'system') || [];
        const lastMessage = userMessages[userMessages.length - 1]?.content || '';

        return this.commandBus.execute(
            new CreatePromptForTerminatorCommand({
                prompt: lastMessage,
                model: body.model || 'gemini-1.5-flash',
                provider: 'google',
                localId: `cont-${Date.now()}`,
                senderId: 'continue-extension',
                receiverId: 'terminator-ai'
            } as any)
        );
    }
    // @Roles('ADMIN')
    // @UseGuards(AuthAccessGuard)
    @Get('/static/ftp/img/:folder')
    async getFtpFilesController(@Param('folder') folder: string) {
        console.log('getFtpFilesController: folder', folder)
        return await this.adminQueryService.getFtpFilesByFolder(folder)
    }
    // @Roles('ADMIN')
    @Get('/static/ftp/:folder')
    // @UseGuards(AuthAccessGuard)
    @UseInterceptors(ValidateFtpFileInterceptor)
    async getFtpFileController(
        @Param('folder') folder: string,
        @Query('fileName') fileName: string,
        @Res() res: any // Добавь @Res()
    ) {
        const resFileName = await this.adminQueryService.getMimeType(fileName);
        const resFilePath = await this.adminQueryService.getFtpFileByFolderAndName(folder, fileName);
        console.log('getFtpFileController: folder, resFileName, resFilePath 😡', folder, resFileName, resFilePath)

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