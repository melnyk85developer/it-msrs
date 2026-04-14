import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { CommandBus } from '@nestjs/cqrs';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CreateMerchandiseInfoInputDto } from '../merchandise-Info-dto/create-merchandise-Info.input-dto';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { GetMerchandiseInfoQueryParams } from '../merchandise-Info-dto/get-merchandise-Info-query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UpdateMerchandiseInfoInputDto } from '../merchandise-Info-dto/update-input-merchandise-Info.dto';
import { MerchandiseInfoViewDto } from '../merchandise-Info-dto/merchandise-Info.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { CreateMerchandiseInfoCommand } from '../merchandise-Info-application/merchandise-Info.use-cases/create-merchandise-Info.use-case';
import { UpdateMerchandiseInfoCommand } from '../merchandise-Info-application/merchandise-Info.use-cases/update-merchandise-Info.use-case';
import { DeleteMerchandiseInfoCommand } from '../merchandise-Info-application/merchandise-Info.use-cases/delete-merchandise-Info.use-case';
import { MerchandiseInfo } from '../merchandiseInfo-domain/merchandise-Info-entity';
import { MerchandiseInfoQueryRepository } from '../merchandiseInfo-infrastructure/merchandise-Info.query-repository';

@Controller('/merchandise-info')
export class MerchandiseInfoController {
    constructor(
        private commandBus: CommandBus,
        private merchandiseInfoQueryRepository: MerchandiseInfoQueryRepository,
    ) { }

    @ApiOperation({ summary: 'Создание информации, описания товара!' })
    @ApiResponse({ status: 200 })
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createMerchandiseInfoController(
        @Body() dto: CreateMerchandiseInfoInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<MerchandiseInfoViewDto> {
        // console.log('createPhotoAlbumController: - dto', dto)
        const productId = await this.commandBus.execute<CreateMerchandiseInfoCommand, string>(
            new CreateMerchandiseInfoCommand(
                user.id,
                dto
            ),
        );
        // console.log('createPhotoAlbumController: - albumId', albumId)
        return await this.merchandiseInfoQueryRepository.findMerchandiseInfoByIdOrNotFoundFailRepository(productId);
    }

    @ApiOperation({ summary: 'Обновление информации, описания товара!' })
    @ApiResponse({ status: 201, type: MerchandiseInfo })
    @UseGuards(AuthAccessGuard)
    @Put('/:infoId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateMerchandiseInfoController(
        @Param('infoId') infoId: string,
        @Body() dto: UpdateMerchandiseInfoInputDto,
    ) {
        // console.log('updatePhotoAlbumController: - dto', dto)
        return await this.commandBus.execute<UpdateMerchandiseInfoCommand, string>(
            new UpdateMerchandiseInfoCommand(
                infoId,
                dto
            ),
        );
    }
    @ApiOperation({ summary: 'Удаление информации, описания товара!' })
    @ApiResponse({ status: 204, type: MerchandiseInfo })
    @UseGuards(AuthAccessGuard)
    @Delete('/:infoId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteMerchandiseInfoController(
        @Param('infoId') infoId: string
    ) {
        // console.log('PhotoAlbumController: - deletePhotoAlbumController albumId', albumId)
        return await this.commandBus.execute<DeleteMerchandiseInfoCommand, string>(
            new DeleteMerchandiseInfoCommand(
                infoId
            ),
        );
    }
    @ApiOperation({ summary: 'Получить информацию, описание товара!' })
    @ApiResponse({ status: 200, type: MerchandiseInfo })
    @Get('/:infoId')
    async getMerchandiseInfoByIdController(
        @Param('infoId') infoId: string
    ) {
        return await this.merchandiseInfoQueryRepository.findMerchandiseInfoByIdOrNotFoundFailRepository(infoId);
    }
}