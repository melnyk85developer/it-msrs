import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { PhotoAlbumService } from '../photo-album-application/photo-album-service';
import { PhotoAlbumQueryRepository } from '../photo-album-infrastructure/photo-album.query-repository';
import { CreatePhotoAlbumInputDto } from '../photo-album-dto/photo-album.input-dto';
import { AuthAccessGuard } from 'src/modules/user.accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user.accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user.accounts/users-guards/dto/user-context.dto';
import { PhotoAlbum } from '../photo-album-domain/photo-album-entity';
import { GetPhotoAlbumQueryParams } from '../photo-album-dto/get-photo-album-query-params.input-dto';

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
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'miniature', maxCount: 1 },
    ]))
    async createPhotoAlbum(@Body() dto: CreatePhotoAlbumInputDto, @ExtractUserFromRequest() user: UserContextDto) {
        return await this.photoAlbumService.createPhotoAlbumService(user.id, dto)
    }

    @ApiOperation({ summary: 'Создание всех фото!' })
    @ApiResponse({ status: 200, type: PhotoAlbum })
    @Get('/all/:userId')
    async getAllPhotoAlbumsController(@Param('userId') userId: string, @Query() query: GetPhotoAlbumQueryParams) {
        console.log('PhotoAlbumController: - getAllPhotoController userId', userId)
        return await this.photoAlbumQueryRepository.getAllPhotoAlbumsQueryRepository(query, userId)
    }
    @ApiOperation({ summary: 'Получение одного фото!' })
    @ApiResponse({ status: 200, type: PhotoAlbum })
    @Get('/:albumId')
    async getPhotoByIdController(@Param('albumId') albumId: string) {
        return await this.photoAlbumQueryRepository.findPhotoAlbumByIdOrNotFoundFailRepository(albumId);
    }
}