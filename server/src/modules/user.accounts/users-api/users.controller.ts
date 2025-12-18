import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserViewDto } from '../users-dto/users.view-dto';
import { UsersService } from '../users-application/users.service';
import { UsersQueryRepository } from '../users-infrastructure/users.query-repository';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { CreateUserInputDto } from '../users-dto/users.input-dto';
import { UpdateUserInputDto } from '../users-dto/update-user.input-dto';
import { GetUsersQueryParams } from '../users-dto/get-users-query-params.input-dto';
import { AuthAccessGuard } from '../users-guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../users-guards/dto/user-context.dto';
import { UserProfileViewDto } from '../users-dto/user-profile.view-dto';

@Controller('/users')
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
    ) { }

    @ApiOperation({ summary: 'Создать пользователя!' })
    @ApiResponse({ status: 201 })
    // @UseInterceptors(ValidationCreateUserInterceptor)
    @Post('/')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createUserController(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
        console.log('UsersController: createUserController - body 😡 ', body)
        const userId = await this.usersService.createUserService(body, null);
        console.log('UsersController: createUserController - userId 😡 ', userId)
        return this.usersQueryRepository.getUserByIdOrNotFoundFail(String(userId));
    }
    @ApiOperation({ summary: 'Обновить пользователя по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    // @UseInterceptors(ValidationCreateUserInterceptor)
    @Put('/:id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateUserController(@Param('id') id: string, @Body() body: UpdateUserInputDto): Promise<string> {
        // console.log('UsersController: updateUserController - body 😡 ', body)
        const userId = await this.usersService.updateUserService(id, body);
        // console.log('UsersController: updateUserController - userId 😡 ', userId)
        return userId
        // return SuccessResponse(INTERNAL_STATUS_CODE.SUCCESS_UPDATED_USER);
    }
    @ApiOperation({ summary: 'Удалить пользователя по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404 })
    @Delete('/:id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteUserController(@Param('id') id: string): Promise<void> {
        // console.log('UsersController: deleteUserController - id 😡 ', id)
        return this.usersService.deleteUserService(id);
    }
    @ApiOperation({ summary: 'Получить всех пользователей!' })
    @ApiResponse({ status: 200 })
    @Get('/')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getAllUsersController(@Query() query: GetUsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {
        // console.log('UsersController: getAllUsersController - query 😡 ', query)
        const isUsers = await this.usersQueryRepository.getAllUsersQueryRepository(query);
        // console.log('UsersController: getAllUsersController - isUsers 😡 ', isUsers)
        return isUsers
    }
    @UseGuards(AuthAccessGuard)
    @Get('/profile/:userId')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getProfileController(@Param('userId') userId: string, @ExtractUserFromRequest() user: UserContextDto): Promise<UserProfileViewDto> {
        // console.log('UsersController: getProfileController - user 😡😡😡😡😡 ', user)
        // console.log('UsersController: getProfileController - userId 😡😡😡😡😡 ', userId)
        return await this.usersQueryRepository.getProfileQueryRepository(userId)
    }
    @ApiOperation({ summary: 'Получить пользователя по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @Get('/:id')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getUserByIdController(@Param('id') id: string): Promise<UserViewDto> {
        // console.log('UsersController: getUserByIdController - id 😡 ', id)
        return this.usersQueryRepository.getUserByIdOrNotFoundFail(String(id));
    }
}