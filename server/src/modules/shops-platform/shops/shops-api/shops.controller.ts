import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MyShopsQueryRepository } from '../shops-infrastructure/shops.query-repository';
import { MyShops } from '../shops-domain/shops-entity';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { CreateMyShopsInputDto } from '../shops-dto/create-shops-input-dto';
import { GetMyShopsQueryParams } from '../shops-dto/get-shops-query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UpdateMyShopsInputDto } from '../shops-dto/update-shops.input-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { MyShopsViewDto } from '../shops-dto/shops-view-dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateMyShopsCommand } from '../shops-application/shops-use-cases/create-shops.use-case';
import { UpdateMyShopsCommand } from '../shops-application/shops-use-cases/update-shops.use-case';
import { DeleteMyShopsCommand } from '../shops-application/shops-use-cases/delete-shops.use-case';

@Controller('/shops')
export class MyShopsController {
    constructor(
        private commandBus: CommandBus,
        private myShopsQueryRepository: MyShopsQueryRepository
    ) { }

    @ApiOperation({ summary: 'Создание фото!' })
    @ApiResponse({ status: 201, type: MyShops })
    @UseGuards(AuthAccessGuard)
    @Post('/myshop')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'miniature', maxCount: 1 },
    ]))
    async createMyShopsController(
        @Body() dto: CreateMyShopsInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFiles() files: { image?: Multer.File[], miniature?: Multer.File[] }
    ): Promise<MyShopsViewDto> {
        const { image, miniature } = files;
        const imageFile = files?.image?.[0] || null;
        const miniatureFile = files?.miniature?.[0] || null;
        // console.log('PhotoController: createPhotoController - dto', dto)
        // console.log('PhotoController: createPhotoController - imageFile', imageFile)
        const shopId = await this.commandBus.execute<CreateMyShopsCommand, string>(
            new CreateMyShopsCommand(
                user.id,
                dto,
                imageFile,
                miniatureFile
            )
        );
        // console.log('PhotoController: createPhotoController - photoId', photoId)
        return await this.myShopsQueryRepository.findMyShopsByIdOrNotFoundFailRepository(shopId);
    }
    @ApiOperation({ summary: 'Обновление фото!' })
    @ApiResponse({ status: 201, type: MyShops })
    @UseGuards(AuthAccessGuard)
    @Put('myshops/:shopId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'miniature', maxCount: 1 },
    ]))
    async updateMyShopsController(
        @Param('shopId') shopId: string,
        @ExtractUserFromRequest() user: UserContextDto,
        @Body() dto: UpdateMyShopsInputDto,
        @UploadedFiles() files: { image?: Multer.File[], miniature?: Multer.File[] }
    ) {
        // console.log('updatePhotoController: - dto', dto)
        // console.log('FILES:', files)
        if (files === undefined) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_UPDATED_PHOTO)
        }
        const imageFile = files?.image?.[0] || null;
        const miniatureFile = files?.miniature?.[0] || null;

        return await this.commandBus.execute<UpdateMyShopsCommand, string>(
            new UpdateMyShopsCommand(
                user.id,
                shopId,
                dto,
                imageFile,
                miniatureFile
            )
        );
    }
    @ApiOperation({ summary: 'Удаление фото!' })
    @ApiResponse({ status: 204, type: MyShops })
    @UseGuards(AuthAccessGuard)
    @Delete('myshops/:shopId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteMyShopsController(@Param('shopId') shopId: string) {
        // console.log('PhotoController: - deletePhotoController photoId', photoId)
        return await this.commandBus.execute<DeleteMyShopsCommand, string>(
            new DeleteMyShopsCommand(
                shopId
            )
        );
    }

    @ApiOperation({ summary: 'Получение одного фото!' })
    @ApiResponse({ status: 200, type: MyShops })
    @Get('/myshops/:shopId')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getMyShopsByIdController(@Param('userId') shopId: string) {
        return await this.myShopsQueryRepository.findMyShopsByIdOrNotFoundFailRepository(shopId);
    }
    @ApiOperation({ summary: 'Создание всех фото!' })
    @ApiResponse({ status: 200, type: MyShops })
    @Get('/myshops/all')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllMyShopsController(
        @ExtractUserFromRequest() user: UserContextDto,
        @Query() query: GetMyShopsQueryParams
    ): Promise<PaginatedViewDto<MyShopsViewDto[]>> {
        // console.log('PhotoController: - getAllPhotoController userId', userId)
        return await this.myShopsQueryRepository.getAllMyShopsQueryRepository(query, user.id)
    }
    @ApiOperation({ summary: 'Создание всех фото!' })
    @ApiResponse({ status: 200, type: MyShops })
    @Get('/myshops/all')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllShopsController(
        @ExtractUserFromRequest() user: UserContextDto,
        @Query() query: GetMyShopsQueryParams
    ): Promise<PaginatedViewDto<MyShopsViewDto[]>> {
        // console.log('PhotoController: - getAllPhotoController userId', userId)
        return await this.myShopsQueryRepository.getAllMyShopsQueryRepository(query)
    }
}