import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { UserViewDto } from '../users-dto/users.view-dto';
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
import { BasicAuthGuard } from '../users-guards/basic/basic-auth.guard';
import { CreateUserCommand } from '../users-application/user-use-cases/create-user.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../users-application/user-use-cases/update-user.use-case';
import { DeleteUserCommand } from '../users-application/user-use-cases/delete-user.use-case';
import { JwtOptionalAuthGuard } from '../users-guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../users-guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/users')
export class UsersController {
    constructor(
        private commandBus: CommandBus,
        private usersQueryRepository: UsersQueryRepository,
    ) { }

    @ApiOperation({ summary: 'Создать пользователя!' })
    @ApiResponse({ status: 201 })
    @UseGuards(AuthAccessGuard)
    // @UseGuards(BasicAuthGuard)
    @Post('/')
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async createUserController(
        @Body() body: CreateUserInputDto,
        @UploadedFile() image?: Multer.File | undefined
    ): Promise<UserViewDto> {
        console.log('UsersController: createUserController - body 😡 ', body)
        // const userId = await this.usersService.createUserService(body, null);
        const avatar = image ? image : null
        const userId = await this.commandBus.execute<CreateUserCommand, string>(
            new CreateUserCommand(body, avatar),
        );
        console.log('UsersController: createUserController - RES userId 😡 ', userId)
        return this.usersQueryRepository.getUserByIdOrNotFoundFail(userId);
    }
    @ApiOperation({ summary: 'Обновить пользователя по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @UseGuards(AuthAccessGuard)
    // @UseGuards(BasicAuthGuard)
    @Put('/:id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateUserController(
        @Param('id') id: string,
        @Body() body: UpdateUserInputDto,
        @UploadedFile() image?: Multer.File | undefined
    ): Promise<string> {
        // console.log('UsersController: updateUserController - body 😡 ', body)
        const avatar = image ? image : null
        const userId = await this.commandBus.execute<UpdateUserCommand, string>(
            new UpdateUserCommand(id, body, avatar),
        );
        // console.log('UsersController: updateUserController - userId 😡 ', userId)
        return userId
        // return SuccessResponse(INTERNAL_STATUS_CODE.SUCCESS_UPDATED_USER);
    }
    @ApiOperation({ summary: 'Удалить пользователя по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404 })
    @UseGuards(AuthAccessGuard)
    // @UseGuards(BasicAuthGuard)
    @Delete('/:id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteUserController(@Param('id') id: string): Promise<void> {
        // console.log('UsersController: deleteUserController - id 😡 ', id)
        return this.commandBus.execute<DeleteUserCommand, void>(
            new DeleteUserCommand(id)
        );
    }
    @ApiOperation({ summary: 'Получить всех пользователей!' })
    @ApiResponse({ status: 200 })
    // @UseGuards(BasicAuthGuard)
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
    async getProfileController(
        @Param('userId') userId: string,
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<UserProfileViewDto> {
        // console.log('UsersController: getProfileController - user 😡😡😡😡😡 ', user)
        // console.log('UsersController: getProfileController - userId 😡😡😡😡😡 ', userId)
        return await this.usersQueryRepository.getProfileQueryRepository(userId)
    }
    @ApiOperation({ summary: 'Получить пользователя по id.' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/:id')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getUserByIdController(
        @Param('id') id: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto
    ): Promise<UserViewDto> {
        // console.log('UsersController: getUserByIdController - id 😡 ', id)
        return this.usersQueryRepository.getUserByIdOrNotFoundFail(String(id));
    }
}