import { Body, Controller, Post, UseGuards, Get, HttpCode, HttpStatus, UseInterceptors, Redirect, Param, Put, UploadedFile, Query } from '@nestjs/common';
import { AuthAccessGuard } from '../../user-accounts/users-guards/bearer/jwt-auth.guard';
import { ValidateFtpFileInterceptor } from '../../user-accounts/users-interceptors/fileInterceptor';
import { AdminService } from 'src/modules/admin/admin-application/admin-query-service';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAiRequestDto } from '../ai-assistant/ai-assistant-domain/ai-request.dto';
import { OrchestrateAiRequestCommand } from '../ai-assistant/ai-assistant-application/orchestrate-ai-request.use-case';
import { CheckAiClusterConnectionCommand } from '../ai-assistant/ai-assistant-application/check-ai-cluster-connection-use-case';

// @Roles('ADMIN')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly commandBus: CommandBus,
        private adminService: AdminService,
    ) { }
    @Post('/ai-assistant/orchestrate')
    async orchestrate(@Body() dto: CreateAiRequestDto) {
        return this.commandBus.execute(new OrchestrateAiRequestCommand(dto.prompt));
    }
    @Post('/ai-assistant/test-connection')
    @UseGuards(AuthAccessGuard)
    async testConnectionController() {
        return await this.commandBus.execute(new CheckAiClusterConnectionCommand());
    }

    // @Roles('ADMIN')
    @UseGuards(AuthAccessGuard)
    @Get('/static/ftp/img/:folder')
    async getFtpFilesController(@Param('folder') folder: string) {
        console.log('getFtpFilesController: folder', folder)
        return await this.adminService.getFtpFilesByFolder(folder)
    }
    // @Roles('ADMIN')
    @Get('/static/ftp/:folder')
    @UseGuards(AuthAccessGuard)
    @UseInterceptors(ValidateFtpFileInterceptor)
    async getFtpFileController(
        @Param('folder') folder: string,
        @Query('fileName') fileName: string) {
        const resFileName = await this.adminService.getMimeType(fileName);
        const resFilePath = await this.adminService.getFtpFileByFolderAndName(folder, fileName);
        console.log('getFtpFileController: folder, resFileName, resFilePath 😡2', folder, resFileName, resFilePath)
        return {
            resFileName,
            resFilePath
        }
    }
}