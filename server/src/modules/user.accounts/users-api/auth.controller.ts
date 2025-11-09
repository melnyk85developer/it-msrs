import { Body, Controller, Post, UseGuards, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from '../users-application/users.service';
import { CreateUserInputDto } from './input-dto-users/users.input-dto';
import { AuthService } from '../users-application/auth.service';
import { AuthQueryRepository } from '../users-infrastructure/users-external-query/users-query-repository/auth.query-repository';
import { LocalAuthGuard } from '../users-guards/local/local-auth.guard';
import { ExtractUserFromRequest } from '../users-guards/decorators/param/extract-user-from-request.decorator';
import { Nullable, UserContextDto } from '../users-guards/dto/user-context.dto';
import { JwtAuthGuard } from '../users-guards/bearer/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../users-guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../users-guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { MeViewDto } from './view-dto-users/users.view-dto';

@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private authQueryRepository: AuthQueryRepository,
    ) { }
    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    registrationController(@Body() body: CreateUserInputDto): Promise<void> {
        // console.log('AuthController: registrationController - body 😡 ', body)
        return this.usersService.registrationUserService(body);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    //swagger doc
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                login: { type: 'string', example: 'login123' },
                password: { type: 'string', example: 'superpassword' },
            },
        },
    })
    login(@ExtractUserFromRequest() user: UserContextDto): Promise<{ accessToken: string }> {
        return this.authService.login(user.id);
    }

    @ApiBearerAuth()
    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
        return this.authQueryRepository.me(user.id);
    }

    @ApiBearerAuth()
    @Get('me-or-default')
    @UseGuards(JwtOptionalAuthGuard)
    async meOrDefault(@ExtractUserIfExistsFromRequest() user: UserContextDto): Promise<Nullable<MeViewDto>> {
        if (user) {
            return this.authQueryRepository.me(user.id!);
        } else {
            return {
                login: 'anonymous',
                userId: null,
                email: null,
                // firstName: null,
                // lastName: null,
            };
        }
    }
}