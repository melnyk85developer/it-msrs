import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { CommandBus } from '@nestjs/cqrs';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { MerchandiseTypeQueryRepository } from '../merchandise-type-infrastructure/merchandise-type.query-repository';
import { MerchandiseType } from '../merchandise-type-domain/merchandise-type-entity';
import { CreateMerchandiseTypeInputDto } from '../merchandise-type-dto/merchandise-type.input-dto';
import { MerchandiseTypeViewDto } from '../merchandise-type-dto/merchandise-type.view-dto';
import { UpdateMerchandiseTypeInputDto } from '../merchandise-type-dto/update-input-merchandise-type.dto';
import { UpdateMerchandiseTypeCommand } from '../merchandise-type-application/merchandise-type.use-cases/update-merchandise-type.use-case';
import { DeleteMerchandiseTypeCommand } from '../merchandise-type-application/merchandise-type.use-cases/delete-merchandise-type.use-case';
import { GetMerchandiseTypeQueryParams } from '../merchandise-type-dto/get-merchandise-type-query-params.input-dto';
import { CreateMerchandiseTypeCommand } from '../merchandise-type-application/merchandise-type.use-cases/create-merchandise-type.use-case';
import { JwtOptionalAuthGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-if-exists-from-request.decorator';

@Controller('/merchandise-type')
export class MerchandiseTypeController {
    constructor(
        private commandBus: CommandBus,
        private merchandiseTypeQueryRepository: MerchandiseTypeQueryRepository,
    ) { }

    @ApiOperation({ summary: 'Создание типа товара!' })
    @ApiResponse({ status: 200 })
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createMerchandiseTypeController(
        @Body() dto: CreateMerchandiseTypeInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<MerchandiseTypeViewDto> {
        // console.log('createMerchandiseTypeController: - dto', dto)
        const typeId = await this.commandBus.execute<CreateMerchandiseTypeCommand, string>(
            new CreateMerchandiseTypeCommand(
                user.id,
                dto
            ),
        );
        // console.log('createMerchandiseTypeController: - typeId', typeId)
        return await this.merchandiseTypeQueryRepository.findMerchandiseTypeByIdOrNotFoundFailRepository(typeId);
    }

    @ApiOperation({ summary: 'Обновление типа товара!' })
    @ApiResponse({ status: 201, type: MerchandiseType })
    @UseGuards(AuthAccessGuard)
    @Put('/:typeId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateMerchandiseTypeController(
        @Param('typeId') typeId: string,
        @Body() dto: UpdateMerchandiseTypeInputDto
    ) {
        // console.log('updateMerchandiseTypeController: - dto', dto)
        return await this.commandBus.execute<UpdateMerchandiseTypeCommand, string>(
            new UpdateMerchandiseTypeCommand(
                typeId,
                dto
            ),
        );
    }
    @ApiOperation({ summary: 'Удаление типа товара!' })
    @ApiResponse({ status: 204, type: MerchandiseType })
    @UseGuards(AuthAccessGuard)
    @Delete('/:typeId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteMerchandiseTypeController(@Param('typeId') typeId: string) {
        // console.log('PhotoAlbumController: - deletePhotoAlbumController albumId', albumId)
        return await this.commandBus.execute<DeleteMerchandiseTypeCommand, string>(
            new DeleteMerchandiseTypeCommand(
                typeId
            )
        );
    }
    @ApiOperation({ summary: 'Получить все типы товаров!' })
    @ApiResponse({ status: 200, type: MerchandiseType })
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/types')
    async getAllMerchandiseTypeController(
        @Query() query: GetMerchandiseTypeQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ): Promise<PaginatedViewDto<MerchandiseTypeViewDto[]>> {
        // console.log('PhotoAlbumController: - getAllPhotoController userId', userId)
        return await this.merchandiseTypeQueryRepository.getAllMerchandiseTypeQueryRepository(query)
    }
    @ApiOperation({ summary: 'Получить тип товарa!' })
    @ApiResponse({ status: 200, type: MerchandiseType })
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/type/:typeId')
    async getMerchandiseTypeByIdController(
        @Param('typeId') typeId: string
    ) {
        return await this.merchandiseTypeQueryRepository.findMerchandiseTypeByIdOrNotFoundFailRepository(typeId);
    }
}