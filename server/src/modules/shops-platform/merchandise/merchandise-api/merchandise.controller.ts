import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { CommandBus } from '@nestjs/cqrs';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MerchandiseQueryRepository } from '../merchandise-infrastructure/merchandise.query-repository';
import { CreateMerchandiseInputDto } from '../merchandise-dto/create-merchandise.input-dto';
import { AuthAccessGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from 'src/modules/user-accounts/users-guards/dto/user-context.dto';
import { Merchandise } from '../merchandise-domain/merchandise.entity';
import { GetMerchandiseQueryParams } from '../merchandise-dto/get-merchandise-query-params.input-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UpdateMerchandiseInputDto } from '../merchandise-dto/update-input-merchandise.dto';
import { MerchandiseViewDto } from '../merchandise-dto/merchandise.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { CreateMerchandiseCommand } from '../merchandise-application/merchandise.use-cases/create-merchandise.use-case';
import { UpdateMerchandiseCommand } from '../merchandise-application/merchandise.use-cases/update-merchandise.use-case';
import { DeleteMerchandiseCommand } from '../merchandise-application/merchandise.use-cases/delete-merchandise.use-case';
import { JwtOptionalAuthGuard } from 'src/modules/user-accounts/users-guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from 'src/modules/user-accounts/users-guards/decorators/param/extract-user-if-exists-from-request.decorator';

@Controller('/merchandise')
export class MerchandiseController {
    constructor(
        private commandBus: CommandBus,
        private merchandiseQueryRepository: MerchandiseQueryRepository,
    ) { }

    @ApiOperation({ summary: 'Создание (добавление) товара!' })
    @ApiResponse({ status: 200 })
    @UseGuards(AuthAccessGuard)
    @Post()
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
    ]))
    async createMerchandiseController(
        @Body() dto: CreateMerchandiseInputDto,
        @UploadedFiles() files: { image?: Multer.File },
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<MerchandiseViewDto> {
        // console.log('createMerchandiseController: - dto', dto)
        // console.log('createMerchandiseController: - files', files)

        const merchandiseFile = files?.image?.[0] || null;
        // console.log('createMerchandiseController: - merchandiseFile', merchandiseFile)

        const productId = await this.commandBus.execute<CreateMerchandiseCommand, string>(
            new CreateMerchandiseCommand(
                user.id,
                dto,
                merchandiseFile
            ),
        );
        // console.log('createMerchandiseController: - productId', productId)
        return await this.merchandiseQueryRepository.findMerchandiseByIdOrNotFoundFailRepository(productId);
    }

    @ApiOperation({ summary: 'Обновление товара по merchandiseId!' })
    @ApiResponse({ status: 201, type: Merchandise })
    @UseGuards(AuthAccessGuard)
    @Put('/:merchandiseId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
    ]))
    async updateMerchandiseController(
        @Param('merchandiseId') merchandiseId: string,
        @Body() dto: UpdateMerchandiseInputDto,
        @UploadedFiles() files: { image?: Multer.File },
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ) {
        // console.log('updateMerchandiseController: - dto', dto)
        // console.log('FILES:', files)
        // if (files === undefined) {
        //     throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_UPDATED_PHOTO)
        // }
        const merchandiseImg = files?.image?.[0] || null;

        return await this.commandBus.execute<UpdateMerchandiseCommand, string>(
            new UpdateMerchandiseCommand(
                merchandiseId,
                dto,
                user.id,
                merchandiseImg,
            ),
        );
    }
    @ApiOperation({ summary: 'Удалить один товар по merchandiseId!' })
    @ApiResponse({ status: 204, type: Merchandise })
    @UseGuards(AuthAccessGuard)
    @Delete('/:merchandiseId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteMerchandiseController(
        @Param('merchandiseId') merchandiseId: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ) {
        // console.log('MerchandiseController: - deleteMerchandiseController merchandiseId', merchandiseId)
        return await this.commandBus.execute<DeleteMerchandiseCommand, string>(
            new DeleteMerchandiseCommand(
                merchandiseId,
                user.id
            ),
        );
    }
    @ApiOperation({ summary: 'Получить все товары!' })
    @ApiResponse({ status: 200, type: Merchandise })
    @UseGuards(JwtOptionalAuthGuard)
    @Get()
    async getAllMerchandiseController(
        @Query() query: GetMerchandiseQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ): Promise<PaginatedViewDto<MerchandiseViewDto[]>> {
        // console.log('MerchandiseController: - getAllMerchandiseController query', query)
        return await this.merchandiseQueryRepository.getAllMerchandiseQueryRepository(query, user?.id)
    }
    @ApiOperation({ summary: 'Получить один товар по merchandiseId!' })
    @ApiResponse({ status: 200, type: Merchandise })
    @Get('/:merchandiseId')
    async getMerchandiseByIdController(
        @Param('merchandiseId') merchandiseId: string
    ) {
        return await this.merchandiseQueryRepository.findMerchandiseByIdOrNotFoundFailRepository(merchandiseId);
    }
}