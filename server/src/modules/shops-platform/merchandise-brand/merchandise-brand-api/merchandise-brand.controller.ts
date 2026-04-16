import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';
import { CommandBus } from '@nestjs/cqrs';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MerchandiseBrandQueryRepository } from '../merchandise-brand-infrastructure/merchandise-brand.query-repository';
import { CreateMerchandiseBrandInputDto } from '../merchandise-brand-dto/merchandise-brand.input-dto';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { MerchandiseBrand } from '../merchandise-brand-domain/merchandise-brand.entity';
import { GetMerchandiseBrandQueryParams } from '../merchandise-brand-dto/get-merchandise-brand-query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UpdateMerchandiseBrandInputDto } from '../merchandise-brand-dto/update-input-merchandise-brand.dto';
import { MerchandiseBrandViewDto } from '../merchandise-brand-dto/merchandise-brand.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { CreateMerchandiseBrandCommand } from '../merchandise-brand-application/merchandise-brand-use-cases/create-merchandise-brand.use-case';
import { UpdateMerchandiseBrandCommand } from '../merchandise-brand-application/merchandise-brand-use-cases/update-merchandise-brand.use-case';
import { DeleteMerchandiseBrandCommand } from '../merchandise-brand-application/merchandise-brand-use-cases/delete-merchandise-brand.use-case';
import { MerchandiseViewDto } from '../../merchandise/merchandise-dto/merchandise.view-dto';
import { ExtractUserIfExistsFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { JwtOptionalAuthGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-optional-auth.guard';

// @ApiTags('Бренды')
@Controller('/brands')
export class MerchandiseBrandController {
    constructor(
        private commandBus: CommandBus,
        private merchandiseBrandQueryRepository: MerchandiseBrandQueryRepository,
    ) { }

    @ApiOperation({ summary: 'Создание бренда для товара в магазине!' })
    @ApiResponse({ status: 200 })
    @UseGuards(AuthAccessGuard)
    @Post('/brand')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createMerchandiseBrandController(
        @Body() dto: CreateMerchandiseBrandInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<MerchandiseBrandViewDto> {
        // console.log('createMerchandiseBrandController: - dto', dto)
        const brandId = await this.commandBus.execute<CreateMerchandiseBrandCommand, string>(
            new CreateMerchandiseBrandCommand(
                user.id,
                dto
            ),
        );
        // console.log('createMerchandiseBrandController: - brandId', brandId)
        return await this.merchandiseBrandQueryRepository.findMerchandiseBrandByIdOrNotFoundFailRepository(brandId);
    }

    @ApiOperation({ summary: 'Обновление бренда для товара в магазине!' })
    @ApiResponse({ status: 201, type: MerchandiseBrand })
    @UseGuards(AuthAccessGuard)
    @Put('/brand/:brandId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateMerchandiseBrandController(
        @Param('brandId') brandId: string,
        @Body() dto: UpdateMerchandiseBrandInputDto
    ) {
        // console.log('MerchandiseBrandController: - dto', dto)
        return await this.commandBus.execute<UpdateMerchandiseBrandCommand, string>(
            new UpdateMerchandiseBrandCommand(
                brandId,
                dto
            ),
        );
    }
    @ApiOperation({ summary: 'Удаление бренда для товара в магазине!' })
    @ApiResponse({ status: 204, type: MerchandiseBrand })
    @UseGuards(AuthAccessGuard)
    @Delete('/brand/:brandId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteMerchandiseBrandController(
        @Param('brandId') brandId: string
    ) {
        // console.log('MerchandiseBrandController: - deleteMerchandiseBrandController brandId', brandId)
        return await this.commandBus.execute<DeleteMerchandiseBrandCommand, string>(
            new DeleteMerchandiseBrandCommand(
                brandId
            ),
        );
    }
    @ApiOperation({ summary: 'Получить все бренды товаров магазина!' })
    @ApiResponse({ status: 200, type: MerchandiseBrand })
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/brand')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllMerchandiseBrandController(
        @Query() query: GetMerchandiseBrandQueryParams,
        // @ExtractUserIfExistsFromRequest() user: UserContextDto
    ): Promise<PaginatedViewDto<MerchandiseBrandViewDto[]>> {
        // console.log('MerchandiseBrandController: - getAllMerchandiseBrandController query', query)
        return await this.merchandiseBrandQueryRepository.getAllMerchandiseBrandQueryRepository(query)
    }
    @ApiOperation({ summary: 'Получение одного бренда товара в магазине!' })
    @ApiResponse({ status: 200, type: MerchandiseBrand })
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/brand/:brandId')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getMerchandiseBrandByIdController(
        @Param('brandId') brandId: string
    ) {
        return await this.merchandiseBrandQueryRepository.findMerchandiseBrandByIdOrNotFoundFailRepository(brandId);
    }
}