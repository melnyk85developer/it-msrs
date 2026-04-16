import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { BasketQueryRepository } from '../basket-infrastructure/basket.query-repository';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { BasketViewDto } from '../basket-dto/basket.view-dto';
import { DeleteBasketCommand } from '../basket-application/basket.use-cases/delete-basket.use-case';
import { CreateBasketInputDto } from '../basket-dto/basket.input-dto';
import { Basket } from '../basket-domain/basket-entity';
import { CreateBasketCommand } from '../basket-application/basket.use-cases/create-basket.use-case';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { GetQueryBasketCommand } from '../basket-application/basket.use-cases/get-basket-or-create.query-use-case';

@ApiTags('Корзина')
@Controller('/basket')
export class BasketController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private basketQueryRepository: BasketQueryRepository,
    ) { }

    @ApiOperation({ summary: 'Создание корзины!' })
    @ApiResponse({ status: 200 })
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createBasketController(
        @Body() dto: CreateBasketInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<BasketViewDto> {
        // console.log('createBasketController: - dto', dto)
        const basketId = await this.commandBus.execute<CreateBasketCommand, string>(
            new CreateBasketCommand(
                user.id,
                dto
            )
        );
        // console.log('createBasketController: - albumId', albumId)
        return await this.basketQueryRepository.findBasketByIdOrNotFoundFailRepository(basketId);
    }

    @ApiOperation({ summary: 'Удалить карзину!' })
    @ApiResponse({ status: 204, type: Basket })
    @UseGuards(AuthAccessGuard)
    @Delete('/:basketId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteBasketController(
        @Param('basketId') basketId: string,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        // console.log('BasketController: - deleteBasketController basketId', basketId)
        return await this.commandBus.execute<DeleteBasketCommand, string>(
            new DeleteBasketCommand(
                user.id,
                basketId
            ),
        );
    }
    @ApiOperation({ summary: 'Получить одну корзину!' })
    @ApiResponse({ status: 200, type: Basket })
    @UseGuards(AuthAccessGuard)
    @Get('/:basketId')
    async getBasketByIdController(
        @Param('basketId') basketId: string,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        return await this.basketQueryRepository.findBasketByIdOrNotFoundFailRepository(basketId);
    }
    @ApiOperation({ summary: 'Получить мою корзину!' })
    @ApiResponse({ status: 200, type: Basket })
    @UseGuards(AuthAccessGuard)
    @Get()
    async getMyBasketByIdController(
        @Query() query: { shopId: string, userId: string },
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        // console.log('getMyBasketByIdController: - query', query)
        return await this.queryBus.execute(new GetQueryBasketCommand(user.id));
    }
}