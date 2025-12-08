import { Body, Controller, Post, UseGuards, Get, HttpCode, HttpStatus, UseInterceptors, Redirect, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../../user.accounts/users-application/users.service';
import { AuthService } from '../auth-application/auth.service';
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
import { RessetPasswordDto } from 'src/modules/user.accounts/users-dto/resset-password-dto';

@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private authQueryRepository: AuthQueryRepository,
    ) { }
    @Post('/registration')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async registrationController(@Body() body: CreateUserInputDto): Promise<string> {
        // console.log('AuthController: registrationController - body 👽 😡 👽', body)
        return this.authService.registrationService(body);
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
        // console.log('refreshController: refreshTokenPayload - 👽👽👽', refreshTokenPayload)
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
    @UseGuards(AuthRefreshGuard)
    @UseInterceptors(ClearCookieInterceptor)
    @Post('/logout')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async logoutController(@ExtractDeviceInfo() deviceInfo: DeviceInfo, @ExtractRefreshPayload() refreshTokenPayload: any) {
        const isLogout = await this.authService.logoutService(
            deviceInfo.refreshToken as string,
            refreshTokenPayload
        );
        console.log('logoutController: isLogout 👽👽😡👽👽 RES', isLogout)
        return isLogout
    }
    @ApiBearerAuth()
    @Get('/me')
    @UseGuards(AuthAccessGuard)
    async meController(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
        // console.log('AuthController: me - user 👽😡👽 ', user)
        return this.authQueryRepository.me(user.id);
    }
    @Post('/registration-email-resending')
    @ApiResponse({ status: 200, description: 'Повторная отправка для активации аккаунта!' })
    async registrationEmailResendingController(@Body() userDto: CreateUserInputDto) {
        return await this.authService.registrationEmailResendingService(userDto.email)
    }
    @Redirect(process.env.CLIENT_URL, 3000) // Указываем дефолтный URL для редиректа
    @Get('/registration-confirmation')
    async registrationСonfirmationController(@Body() confirmationCode: string) {
        const isActivated = await this.authService.confirmationCodeRegistrationService(confirmationCode);
        if (isActivated === true) {
            return { url: process.env.CLIENT_URL }; // URL для перенаправления
        }
    }
    @ApiResponse({ status: 204, description: 'Отправка письма для сбросса пароля!' })
    @Post('/password-recovery')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async passwordRecoverySendEmailController(@Body() dto: any) {
        return await this.authService.passwordRecoverySendEmailService(dto.email)
    }
    @ApiResponse({ status: 204, description: 'Ожидаем новый пароль и код подтверждения для обновления пароля!' })
    @Put('/new-password')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async ressetPasswordController(@Body() body: RessetPasswordDto) {
        return await this.authService.ressetPasswordService(body.password, body.code)
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