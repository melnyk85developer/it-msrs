import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from '../photos-application/photos-service';
import { PhotoQueryRepository } from '../photos-infrastructure/photos.query-repository';
import { Photo } from '../photos-domain/photos-entity';
import { UsersQueryRepository } from 'src/modules/user.accounts/users-infrastructure/users.query-repository';
import { CreatePhotoDto } from '../photos-dto/create-photo-dto';
import { AuthAccessGuard } from 'src/modules/user.accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user.accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user.accounts/users-guards/dto/user-context.dto';
import { CreatePhotoInputDto } from '../photos-dto/create-photo-input-dto';
import { GetPhotoQueryParams } from '../photos-dto/get-photos-query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UpdatePhotoDto } from '../photos-dto/update-photo-dto';
import { UpdatePhotoInputDto } from '../photos-dto/update-input-photo-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { PhotoViewDto } from '../photos-dto/photo-view-dto';

@Controller('/photos')
export class PhotoController {
    constructor(
        private photoService: PhotoService,
        private photoQueryRepository: PhotoQueryRepository,
        private usersQueryRepository: UsersQueryRepository
    ) { }

    @ApiOperation({ summary: 'Создание фото!' })
    @ApiResponse({ status: 201, type: Photo })
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'miniature', maxCount: 1 },
    ]))
    async createPhotoController(
        @Body() dto: CreatePhotoInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFiles() files: Multer.File
    ): Promise<PhotoViewDto> {
        const { image, miniature } = files;
        // console.log('PhotoController: createPhotoController - dto', dto)
        const photoId = await this.photoService.createPhotoService(
            user.id,
            dto,
            image[0],
            miniature[0]
        )
        // console.log('PhotoController: createPhotoController - photoId', photoId)

        return await this.photoQueryRepository.findPhotoByIdOrNotFoundFailRepository(photoId);
    }
    @UseGuards(AuthAccessGuard)
    @Put('/:photoId')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'miniature', maxCount: 1 },
    ]))
    async updatePhotoController(
        @Param('photoId') photoId: string,
        @Body() dto: UpdatePhotoInputDto,
        @UploadedFiles() files: Multer.File
    ) {
        console.log('updatePhotoController: - dto', dto)
        // console.log('FILES:', files)
        if (files === undefined) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_UPDATED_PHOTO)
        }
        const { image, miniature } = files;
        const { albumName } = dto

        return await this.photoService.updatePhotoService(
            photoId,
            image[0],
            miniature[0],
            albumName
        );
    }
    @ApiOperation({ summary: 'Удаление фото!' })
    @ApiResponse({ status: 204, type: Photo })
    @UseGuards(AuthAccessGuard)
    @Delete('/:photoId')
    async deletePhotoController(@Param('photoId') photoId: string) {
        return await this.photoService.deletePhotoService(photoId)
    }

    @ApiOperation({ summary: 'Получение одного фото!' })
    @ApiResponse({ status: 200, type: Photo })
    @Get('/:photoId')
    async getPhotoByIdController(@Param('photoId') photoId: string) {
        return await this.photoQueryRepository.findPhotoByIdOrNotFoundFailRepository(photoId);
    }
    @ApiOperation({ summary: 'Создание всех фото!' })
    @ApiResponse({ status: 200, type: Photo })
    @Get('/miniatures/:userId')
    async getAllPhotoController(@Param('userId') userId: string, @Query() query: GetPhotoQueryParams): Promise<PaginatedViewDto<PhotoViewDto[]>> {
        // console.log('PhotoController: - getAllPhotoController userId', userId)
        return await this.photoQueryRepository.getAllPhotoQueryRepository(query, userId)
    }
}