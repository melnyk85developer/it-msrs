import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { PhotoAlbumService } from '../photo-album-application/photo-album-service';
import { PhotoAlbumQueryRepository } from '../photo-album-infrastructure/photo-album.query-repository';
import { CreatePhotoAlbumInputDto } from '../photo-album-dto/photo-album.input-dto';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { PhotoAlbum } from '../photo-album-domain/photo-album-entity';
import { GetPhotoAlbumQueryParams } from '../photo-album-dto/get-photo-album-query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UpdatePhotoAlbumInputDto } from '../photo-album-dto/update-input-photo-album-dto';
import { PhotoAlbumViewDto } from '../photo-album-dto/photo-album.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';

@Controller('/photo-albums')
export class PhotoAlbumController {
    constructor(
        private photoAlbumQueryRepository: PhotoAlbumQueryRepository,
        private photoAlbumService: PhotoAlbumService,
    ) { }

    @ApiOperation({ summary: 'Создание фотоальбома!' })
    @ApiResponse({ status: 200 })
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'albumCoverFile', maxCount: 1 },
    ]))
    async createPhotoAlbumController(
        @Body() dto: CreatePhotoAlbumInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFiles() files: { albumCoverFile?: Multer.File }
    ): Promise<PhotoAlbumViewDto> {
        console.log('createPhotoAlbumController: - dto', dto)

        const albumCoverFile = files?.albumCoverFile?.[0] || null;

        const albumId = await this.photoAlbumService.createPhotoAlbumService(
            user.id,
            albumCoverFile,
            dto
        )
        // console.log('createPhotoAlbumController: - albumId', albumId)
        return await this.photoAlbumQueryRepository.findPhotoAlbumByIdOrNotFoundFailRepository(albumId);
    }

    @ApiOperation({ summary: 'Обновление фото!' })
    @ApiResponse({ status: 201, type: PhotoAlbum })
    @UseGuards(AuthAccessGuard)
    @Put('/:albumId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'albumCoverFile', maxCount: 1 },
    ]))
    async updatePhotoAlbumController(
        @Param('albumId') albumId: string,
        @Body() dto: UpdatePhotoAlbumInputDto,
        @UploadedFiles() files: { albumCoverFile?: Multer.File }
    ) {
        console.log('updatePhotoAlbumController: - dto', dto)
        // console.log('FILES:', files)
        if (files === undefined) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_UPDATED_PHOTO)
        }

        const albumCoverFile = files?.albumCoverFile?.[0] || null;

        return await this.photoAlbumService.updatePhotoAlbumService(
            albumId,
            dto,
            albumCoverFile
        );
    }
    @ApiOperation({ summary: 'Удаление фотоальбома!' })
    @ApiResponse({ status: 204, type: PhotoAlbum })
    @UseGuards(AuthAccessGuard)
    @Delete('/:albumId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deletePhotoAlbumController(@Param('albumId') albumId: string) {
        console.log('PhotoAlbumController: - deletePhotoAlbumController albumId', albumId)
        return await this.photoAlbumService.deletePhotoAlbumService(albumId)
    }
    @ApiOperation({ summary: 'Создание всех фото!' })
    @ApiResponse({ status: 200, type: PhotoAlbum })
    @Get('/all/:userId')
    async getAllPhotoAlbumsController(@Param('userId') userId: string, @Query() query: GetPhotoAlbumQueryParams): Promise<PaginatedViewDto<PhotoAlbumViewDto[]>> {
        // console.log('PhotoAlbumController: - getAllPhotoController userId', userId)
        return await this.photoAlbumQueryRepository.getAllPhotoAlbumsQueryRepository(query, userId)
    }
    @ApiOperation({ summary: 'Получение одного фото!' })
    @ApiResponse({ status: 200, type: PhotoAlbum })
    @Get('/:albumId')
    async getPhotoByIdController(@Param('albumId') albumId: string) {
        return await this.photoAlbumQueryRepository.findPhotoAlbumByIdOrNotFoundFailRepository(albumId);
    }
}