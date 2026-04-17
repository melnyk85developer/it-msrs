import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ShopBrandQueryRepository } from '../shop-brand-infrastructure/shop-brand.query-repository';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { CreateShopBrandInputDto } from '../shop-brand-dto/create-shop-brand.input-dto';
import { GetShopBrandQueryParams } from '../shop-brand-dto/get-shop-brand-query-params.input-dto';
import { UpdateShopBrandInputDto } from '../shop-brand-dto/update-input-shop-brand-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { ShopBrandViewDto } from '../shop-brand-dto/shop-brand-view-dto';
import { CreateShopBrandCommand } from '../shop-brand-application/shop-brand.use-cases/create-shop-brand.use-case';
import { UpdateShopBrandCommand } from '../shop-brand-application/shop-brand.use-cases/update-shop-brand.use-case';
import { DeleteShopBrandCommand } from '../shop-brand-application/shop-brand.use-cases/delete-shop-brand.use-case';
import { ShopBrand } from '../shop-brand-domain/shop-brand-entity';
import { ExtractUserIfExistsFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { JwtOptionalAuthGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-optional-auth.guard';

@Controller('/shop-brand')
export class ShopBrandController {
    constructor(
        private commandBus: CommandBus,
        private shopBrandQueryRepository: ShopBrandQueryRepository
    ) { }

    @ApiOperation({ summary: 'Создание типа магазина!' })
    @ApiResponse({ status: 201, type: ShopBrand })
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createShoBrandController(
        @Body() dto: CreateShopBrandInputDto,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<ShopBrandViewDto> {
        // console.log('ShopBrandController: createShoBrandController - dto', dto)
        const typeId = await this.commandBus.execute<CreateShopBrandCommand, string>(
            new CreateShopBrandCommand(user.id, dto)
        );
        // console.log('ShopBrandController: createShoBrandController - typeId', typeId)
        return await this.shopBrandQueryRepository.findShopBrandByIdOrNotFoundFailRepository(typeId);
    }
    @ApiOperation({ summary: 'Обновление типа магазина!' })
    @ApiResponse({ status: 201, type: ShopBrand })
    @UseGuards(AuthAccessGuard)
    @Put('/:brandId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateShopBrandController(
        @Param('brandId') brandId: string,
        @Body() dto: UpdateShopBrandInputDto,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ) {
        // console.log('ShopTypeController: - updateShopTypeController dto', dto)
        return await this.commandBus.execute<UpdateShopBrandCommand, string>(
            new UpdateShopBrandCommand(
                brandId,
                user.id,
                dto
            )
        );
    }
    @ApiOperation({ summary: 'Удаление типа магазина!' })
    @ApiResponse({ status: 204, type: ShopBrand })
    @UseGuards(AuthAccessGuard)
    @Delete('/:brandId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteShopBrandController(
        @Param('brandId') brandId: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ) {
        // console.log('PhotoController: - deletePhotoController photoId', photoId)
        return await this.commandBus.execute<DeleteShopBrandCommand, string>(
            new DeleteShopBrandCommand(
                brandId,
                user.id
            )
        );
    }

    @ApiOperation({ summary: 'Получение одного типа магазина по typeId!' })
    @ApiResponse({ status: 200, type: ShopBrand })
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/:brandId')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getShopBrandByIdController(
        @Param('brandId') brandId: string
    ) {
        return await this.shopBrandQueryRepository.findShopBrandByIdOrNotFoundFailRepository(brandId);
    }
    @ApiOperation({ summary: 'Получение всех типов магазинов!' })
    @ApiResponse({ status: 200, type: ShopBrand })
    @UseGuards(JwtOptionalAuthGuard)
    @Get()
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllShopBrandController(
        @Query() query: GetShopBrandQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<PaginatedViewDto<ShopBrandViewDto[]>> {
        // console.log('ShopBrandController: - getAllShopBrandController query', query)
        return await this.shopBrandQueryRepository.getAllShopBrandQueryRepository(
            query,
            user.id
        )
    }
}