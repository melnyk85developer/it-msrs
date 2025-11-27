import { Body, Controller, Post, UseGuards, Get, HttpCode, HttpStatus, UseInterceptors, Redirect, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from '../../user.accounts/users-application/users.service';
import { AuthService } from '../../user.accounts/users-application/auth.service';
import { LocalAuthGuard } from '../../user.accounts/users-guards/local/local-auth.guard';
import { ExtractUserFromRequest } from '../../user.accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { Nullable, UserContextDto } from '../../user.accounts/users-guards/dto/user-context.dto';
import { AuthAccessGuard } from '../../user.accounts/users-guards/bearer/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../../user.accounts/users-guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../user.accounts/users-guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { MeViewDto } from '../../user.accounts/users-dto/users.view-dto';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { SetCookieInterceptor } from 'src/core/utils/SetCookieInterceptor';
import { type DeviceInfo, ExtractDeviceInfo } from '../../user.accounts/users-guards/decorators/param/extract-device-info.decorator';
import { AuthRefreshGuard } from '../../user.accounts/users-guards/refreshTokenGuard';
import { ExtractRefreshPayload } from '../../user.accounts/users-guards/decorators/extract-refresh-payload.decorator';
import { SETTINGS } from 'src/core/settings';
import { ClearCookieInterceptor } from '../../user.accounts/users-interceptors/clear-cookie.interceptor';
import { CreateUserInputDto } from '../../user.accounts/users-dto/users.input-dto';
import { AuthQueryRepository } from '../../user.accounts/users-infrastructure/auth.query-repository';

@Controller('/auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private authQueryRepository: AuthQueryRepository,
    ) { }
    @Post('/registration')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async registrationController(@Body() body: CreateUserInputDto): Promise<string> {
        // console.log('AuthController: registrationController - body 👽 😡 👽', body)
        return this.usersService.registrationService(body);
    }
    @UseGuards(LocalAuthGuard)
    @UseInterceptors(SetCookieInterceptor)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                login: { type: 'string', example: 'login123' },
                password: { type: 'string', example: 'superpassword' },
            },
        },
    })
    @Post('/login')
    @HttpCode(HTTP_STATUSES.OK_200)
    async loginController(
        @ExtractUserFromRequest() user: UserContextDto,
        @ExtractDeviceInfo() deviceInfo: DeviceInfo): Promise<{ accessToken: string, refreshToken: string }> {
        // console.log('AuthController: login - user 😡 REQ', user)
        // console.log('AuthController: login - deviceInfo 😡 REQ', deviceInfo)
        const { accessToken, refreshToken } = await this.authService.loginService(
            deviceInfo.ip,
            deviceInfo.title,
            user.id,
            deviceInfo.refreshToken as string
        );
        // console.log('AuthController: login - accessToken, refreshToken 😡 RES', accessToken, refreshToken)
        return {
            accessToken,
            refreshToken
        }
    }
    @ApiBearerAuth()
    @UseGuards(AuthAccessGuard)
    @UseGuards(AuthRefreshGuard)
    @UseInterceptors(SetCookieInterceptor)
    @Post('/refresh-token')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async refreshController(@ExtractDeviceInfo() deviceInfo: DeviceInfo, @ExtractRefreshPayload() refreshTokenPayload: any): Promise<{ accessToken: string, refreshToken: string }> {
        console.log('refreshController: refreshTokenPayload - 👽👽👽', refreshTokenPayload)
        const isRefresh = await this.authService.refreshService(
            deviceInfo.ip,
            deviceInfo.title,
            refreshTokenPayload,
            deviceInfo.refreshToken as string
        )
        // console.log('refreshController: isRefresh 👽👽😡👽👽 RES', isRefresh)
        return isRefresh
    }
    @ApiBearerAuth()
    // @UseGuards(AuthAccessGuard)
    @UseGuards(AuthRefreshGuard)
    @UseInterceptors(ClearCookieInterceptor) 
    @Post('/logout')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async logoutController(@ExtractDeviceInfo() deviceInfo: DeviceInfo, @ExtractRefreshPayload() refreshTokenPayload: any) {
        return await this.authService.logoutService(
            deviceInfo.refreshToken as string,
            refreshTokenPayload
        );
    }
    @ApiBearerAuth()
    @Get('/me')
    @UseGuards(AuthAccessGuard)
    async meController(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
        // console.log('AuthController: me - user 👽😡👽 ', user)
        return this.authQueryRepository.me(user.id);
    }

    @Redirect(process.env.CLIENT_URL, 3000) // Указываем дефолтный URL для редиректа
    @Get('/registration-confirmation/:link')
    async registrationСonfirmationController(@Param('link') confirmationCode: string) {

        // if (confirmationCode) {
        //     const isActivated = await this.usersService.confirmationCodeRegistrationService(confirmationCode);

        //     if (isActivated === true) {
        //         return { url: process.env.CLIENT_URL }; // URL для перенаправления
        //     }

        //     if (isActivated === INTERNAL_STATUS_CODE.BAD_REQUEST_EXPIRATION_TIME_PASSED) {
        //         throw new ErRes(INTERNAL_STATUS_CODE.BAD_REQUEST_EXPIRATION_TIME_PASSED);
        //     }
        // } else {
        //     throw new ErRes(INTERNAL_STATUS_CODE.BAD_REQUEST_CONFIRMATION_CODE_CANNOT_BE_EMPTY);
        // }

    }
    @ApiBearerAuth()
    @Get('/me-or-default')
    @UseGuards(JwtOptionalAuthGuard)
    async meOrDefault(@ExtractUserIfExistsFromRequest() user: UserContextDto): Promise<Nullable<MeViewDto>> {
        if (user) {
            return this.authQueryRepository.me(user.id!);
        } else {
            return {
                login: 'anonymous',
                id: null,
                email: null,
                // firstName: null,
                // lastName: null,
            };
        }
    }
}