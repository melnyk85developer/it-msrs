import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ShopTypeQueryRepository } from '../shop-type-infrastructure/shop-type.query-repository';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { CreateShopTypeInputDto } from '../shop-type-dto/create-shop-type.input-dto';
import { GetShopTypeQueryParams } from '../shop-type-dto/get-shop-type-query-params.input-dto';
import { UpdateShopTypeInputDto } from '../shop-type-dto/update-input-shop-type-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { ShopTypeViewDto } from '../shop-type-dto/shop-type-view-dto';
import { CreateShopTypeCommand } from '../shop-type-application/shop-type.use-cases/create-shop-type.use-case';
import { UpdateShopTypeCommand } from '../shop-type-application/shop-type.use-cases/update-shop-type.use-case';
import { DeleteShopTypeCommand } from '../shop-type-application/shop-type.use-cases/delete-shop-type.use-case';
import { ShopType } from '../shop-type-domain/shop-type-entity';
import { ExtractUserIfExistsFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { JwtOptionalAuthGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-optional-auth.guard';

@Controller('/shop-type')
export class ShopTypeController {
    constructor(
        private commandBus: CommandBus,
        private shopTypeQueryRepository: ShopTypeQueryRepository
    ) { }

    @ApiOperation({ summary: 'Создание типа магазина!' })
    @ApiResponse({ status: 201, type: ShopType })
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createShopTypeController(
        @Body() dto: CreateShopTypeInputDto,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<ShopTypeViewDto> {
        // console.log('ShopTypeController: createShopTypeController - dto', dto)
        const typeId = await this.commandBus.execute<CreateShopTypeCommand, string>(
            new CreateShopTypeCommand(user.id, dto)
        );
        // console.log('ShopTypeController: createShopTypeController - typeId', typeId)
        return await this.shopTypeQueryRepository.findShopTypeByIdOrNotFoundFailRepository(typeId);
    }
    @ApiOperation({ summary: 'Обновление типа магазина!' })
    @ApiResponse({ status: 201, type: ShopType })
    @UseGuards(AuthAccessGuard)
    @Put('/:typeId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateShopTypeController(
        @Param('typeId') typeId: string,
        @Body() dto: UpdateShopTypeInputDto,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ) {
        // console.log('ShopTypeController: - updateShopTypeController dto', dto)
        return await this.commandBus.execute<UpdateShopTypeCommand, string>(
            new UpdateShopTypeCommand(
                typeId,
                user.id,
                dto
            )
        );
    }
    @ApiOperation({ summary: 'Удаление типа магазина!' })
    @ApiResponse({ status: 204, type: ShopType })
    @UseGuards(AuthAccessGuard)
    @Delete('/:typeId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteShopTypeController(
        @Param('typeId') typeId: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ) {
        // console.log('PhotoController: - deletePhotoController photoId', photoId)
        return await this.commandBus.execute<DeleteShopTypeCommand, string>(
            new DeleteShopTypeCommand(
                typeId,
                user.id
            )
        );
    }

    @ApiOperation({ summary: 'Получение одного типа магазина по typeId!' })
    @ApiResponse({ status: 200, type: ShopType })
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/:typeId')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getShopTypeByIdController(
        @Param('typeId') typeId: string
    ) {
        return await this.shopTypeQueryRepository.findShopTypeByIdOrNotFoundFailRepository(typeId);
    }
    @ApiOperation({ summary: 'Получение всех типов магазинов!' })
    @ApiResponse({ status: 200, type: ShopType })
    @UseGuards(JwtOptionalAuthGuard)
    @Get()
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllShopTypesController(
        @Query() query: GetShopTypeQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<PaginatedViewDto<ShopTypeViewDto[]>> {
        // console.log('ShopTypeController: - getAllShopTypeController query', query)
        return await this.shopTypeQueryRepository.getAllShopTypeQueryRepository(
            query,
            user.id
        )
    }
}