import { Body, Controller, Post, UseGuards, Get, HttpCode, HttpStatus, UseInterceptors, Redirect, Param, Put, UploadedFile, Query } from '@nestjs/common';
import { AuthAccessGuard } from '../../user.accounts/users-guards/bearer/jwt-auth.guard';
import { ValidateFtpFileInterceptor } from '../users-interceptors/fileInterceptor';
import { AdminService } from 'src/modules/notifications/service/adminSrvice/adminSrvice';

@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService,
    ) { }
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