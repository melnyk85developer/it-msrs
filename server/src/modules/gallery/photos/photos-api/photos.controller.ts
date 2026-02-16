import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { PhotoQueryRepository } from '../photos-infrastructure/photos.query-repository';
import { Photo } from '../photos-domain/photos-entity';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { CreatePhotoInputDto } from '../photos-dto/create-photo-input-dto';
import { GetPhotoQueryParams } from '../photos-dto/get-photos-query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UpdatePhotoDto } from '../photos-dto/update-photo-dto';
import { UpdatePhotoInputDto } from '../photos-dto/update-input-photo-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { PhotoViewDto } from '../photos-dto/photo-view-dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePhotoCommand } from '../photos-application/photos-use-cases/create-photo.use-case';
import { UpdatePhotoCommand } from '../photos-application/photos-use-cases/update-photo.use-case';
import { DeletePhotoCommand } from '../photos-application/photos-use-cases/delete-photo.use-case';

@Controller('/photos')
export class PhotoController {
    constructor(
        private commandBus: CommandBus,
        private photoQueryRepository: PhotoQueryRepository
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
        @UploadedFiles() files: { image?: Multer.File[], miniature?: Multer.File[] }
    ): Promise<PhotoViewDto> {
        const { image, miniature } = files;
        const imageFile = files?.image?.[0] || null;
        const miniatureFile = files?.miniature?.[0] || null;
        // console.log('PhotoController: createPhotoController - dto', dto)
        // console.log('PhotoController: createPhotoController - imageFile', imageFile)
        const photoId = await this.commandBus.execute<CreatePhotoCommand, string>(
            new CreatePhotoCommand(user.id,
                dto,
                imageFile,
                miniatureFile)
        );
        // console.log('PhotoController: createPhotoController - photoId', photoId)
        return await this.photoQueryRepository.findPhotoByIdOrNotFoundFailRepository(photoId);
    }
    @ApiOperation({ summary: 'Обновление фото!' })
    @ApiResponse({ status: 201, type: Photo })
    @UseGuards(AuthAccessGuard)
    @Put('/:photoId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'miniature', maxCount: 1 },
    ]))
    async updatePhotoController(
        @Param('photoId') photoId: string,
        @Body() dto: UpdatePhotoInputDto,
        @UploadedFiles() files: { image?: Multer.File[], miniature?: Multer.File[] }
    ) {
        // console.log('updatePhotoController: - dto', dto)
        // console.log('FILES:', files)
        if (files === undefined) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_UPDATED_PHOTO)
        }
        const imageFile = files?.image?.[0] || null;
        const miniatureFile = files?.miniature?.[0] || null;

        return await this.commandBus.execute<UpdatePhotoCommand, string>(
            new UpdatePhotoCommand(
                photoId,
                dto,
                imageFile,
                miniatureFile
            )
        );
    }
    @ApiOperation({ summary: 'Удаление фото!' })
    @ApiResponse({ status: 204, type: Photo })
    @UseGuards(AuthAccessGuard)
    @Delete('/:photoId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deletePhotoController(@Param('photoId') photoId: string) {
        // console.log('PhotoController: - deletePhotoController photoId', photoId)
        return await this.commandBus.execute<DeletePhotoCommand, string>(
            new DeletePhotoCommand(
                photoId
            )
        );
    }

    @ApiOperation({ summary: 'Получение одного фото!' })
    @ApiResponse({ status: 200, type: Photo })
    @Get('/:photoId')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getPhotoByIdController(@Param('photoId') photoId: string) {
        return await this.photoQueryRepository.findPhotoByIdOrNotFoundFailRepository(photoId);
    }
    @ApiOperation({ summary: 'Создание всех фото!' })
    @ApiResponse({ status: 200, type: Photo })
    @Get('/all/:userId')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllPhotoController(@Param('userId') userId: string, @Query() query: GetPhotoQueryParams): Promise<PaginatedViewDto<PhotoViewDto[]>> {
        // console.log('PhotoController: - getAllPhotoController userId', userId)
        return await this.photoQueryRepository.getAllPhotoQueryRepository(query, userId)
    }
}