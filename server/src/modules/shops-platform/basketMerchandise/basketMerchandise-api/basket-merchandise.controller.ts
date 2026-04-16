import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { BasketMerchandiseQueryRepository } from '../basketMerchandise-infrastructure/basket-merchandise.query-repository';
import { CreateBasketMerchandiseInputDto } from '../basketMerchandise-dto/basket-merchandise.input-dto';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { BasketMerchandise } from '../basketMerchandise-domain/basket-merchandise-entity';
import { GetBasketMerchandiseQueryParams } from '../basketMerchandise-dto/get-basket-merchandise-query-params.input-dto';
import { BasketMerchandiseViewDto } from '../basketMerchandise-dto/basket-merchandise.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { CreateBasketMerchandiseCommand } from '../basketMerchandise-application/basket-merchandise.use-cases/create-basket-merchandise.use-case';
import { DeleteBasketMerchandiseCommand } from '../basketMerchandise-application/basket-merchandise.use-cases/delete-basket-merchandise.use-case';

@Controller('/basket-merchandise')
export class BasketMerchandiseController {
    constructor(
        private commandBus: CommandBus,
        private basketMerchandiseQueryRepository: BasketMerchandiseQueryRepository,
    ) { }

    @ApiOperation({ summary: 'Добавление товара в корзину!' })
    @ApiResponse({ status: 200 })
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createBasketMerchandiseController(
        @Body() dto: CreateBasketMerchandiseInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<BasketMerchandiseViewDto> {
        // console.log('BasketMerchandiseController: - dto', dto)
        const basketMerchandiseId = await this.commandBus.execute<CreateBasketMerchandiseCommand, string>(
            new CreateBasketMerchandiseCommand(
                user.id,
                dto
            ),
        );
        // console.log('BasketMerchandiseController: - albumId', albumId)
        return await this.basketMerchandiseQueryRepository.findBasketMerchandiseByIdOrNotFoundFailRepository(basketMerchandiseId);
    }
    @ApiOperation({ summary: 'Удаление фотоальбома!' })
    @ApiResponse({ status: 204, type: BasketMerchandise })
    @UseGuards(AuthAccessGuard)
    @Delete('/:basketMerchandiseId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteBasketMerchandiseController(
        @Param('basketMerchandiseId') basketMerchandiseId: string
    ) {
        // console.log('BasketMerchandiseController: - deleteBasketMerchandiseController albumId', albumId)
        return await this.commandBus.execute<DeleteBasketMerchandiseCommand, string>(
            new DeleteBasketMerchandiseCommand(
                basketMerchandiseId
            ),
        );
    }
    @ApiOperation({ summary: 'Получить все товары добавленные в корзину!' })
    @ApiResponse({ status: 200, type: BasketMerchandise })
    @UseGuards(AuthAccessGuard)
    @Get('/all')
    async getAllBasketMerchandiseController(
        @Query() query: GetBasketMerchandiseQueryParams,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<PaginatedViewDto<BasketMerchandiseViewDto[]>> {
        // console.log('BasketMerchandiseController: - getAllBasketMerchandiseController query', query)
        return await this.basketMerchandiseQueryRepository.getAllBasketMerchandiseQueryRepository(query, user.id)
    }
    @ApiOperation({ summary: 'Получить одно устройство в корзине!' })
    @ApiResponse({ status: 200, type: BasketMerchandise })
    @Get('/:basketMerchandiseId')
    async getBasketMerchandiseByIdController(
        @Param('basketMerchandiseId') basketMerchandiseId: string
    ) {
        return await this.basketMerchandiseQueryRepository.findBasketMerchandiseByIdOrNotFoundFailRepository(basketMerchandiseId);
    }
}