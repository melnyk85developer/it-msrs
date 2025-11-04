import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserViewDto } from './view-dto-users/users.view-dto';
import { UsersService } from '../users-application/users.service';
import { CreateUserInputDto } from './input-dto-users/users.input-dto';
import { UpdateUserInputDto } from './input-dto-users/update-user.input-dto';
import { GetUsersQueryParams } from './input-dto-users/get-users-query-params.input-dto';
import { UsersQueryRepository } from '../users-infrastructure/users-external-query/users-query-repository/users.query-repository';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { ValidationCreateUserInterceptor } from '../users-interceptors/user-create-validation-interceptor';
import { ErRes } from 'src/shared/utils/ErRes';
import { SuccessResponse } from 'src/shared/utils/SuccessfulResponse';
import { INTERNAL_STATUS_CODE } from 'src/shared/utils/utils';

@Controller('users')
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
    ) { }

    @ApiOperation({ summary: 'Создать пользователя!' })
    @ApiResponse({ status: 201 })
    @UseInterceptors(ValidationCreateUserInterceptor)
    @Post()
    async createUserController(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
        // console.log('UsersController: createUserController - body 😡 ', body)
        const userId = await this.usersService.createUserService(body);
        // console.log('UsersController: createUserController - userId 😡 ', userId)
        return this.usersQueryRepository.getUserByIdOrNotFoundFailQueryRepository(userId);
    }
    @ApiOperation({ summary: 'Обновить пользователя по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @UseInterceptors(ValidationCreateUserInterceptor)
    @Put(':id')
    async updateUserController(@Param('id') id: string, @Body() body: UpdateUserInputDto): Promise<UserViewDto> {
        // console.log('UsersController: updateUserController - body 😡 ', body)
        const userId = await this.usersService.updateUserService(id, body);
        // console.log('UsersController: updateUserController - userId 😡 ', userId)
        return SuccessResponse(INTERNAL_STATUS_CODE.SUCCESS_UPDATED_USER);
    }

    @ApiOperation({ summary: 'Удалить пользователя по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404 })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUserController(@Param('id') id: string): Promise<void> {
        // console.log('UsersController: deleteUserController - id 😡 ', id)
        return this.usersService.deleteUserService(id);
    }
    @ApiOperation({ summary: 'Получить всех пользователей!' })
    @ApiResponse({ status: 200 })
    @Get()
    async getAllUsersController(@Query() query: GetUsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {
        // console.log('UsersController: getAllUsersController - query 😡 ', query)
        const isUsers = await this.usersQueryRepository.getAllUsersQueryRepository(query);
        // console.log('UsersController: getAllUsersController - isUsers 😡 ', isUsers)
        return isUsers
    }
    @ApiOperation({ summary: 'Получить пользователя по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @Get(':id')
    async getUserByIdController(@Param('id') id: string): Promise<UserViewDto> {
        // console.log('UsersController: getUserByIdController - id 😡 ', id)
        return this.usersQueryRepository.getUserByIdOrNotFoundFailQueryRepository(id);
    }
}