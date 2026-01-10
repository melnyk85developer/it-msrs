import { Body, Controller, Post, UseGuards, Get, HttpCode, HttpStatus, UseInterceptors, Redirect, Param, Put, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
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
import { ClearCookieInterceptor } from '../../user.accounts/users-interceptors/clear-cookie.interceptor';
import { CreateUserInputDto } from '../../user.accounts/users-dto/users.input-dto';
import { AuthQueryRepository } from '../../user.accounts/users-infrastructure/auth.query-repository';
import { RessetPasswordDto } from 'src/modules/user.accounts/users-dto/resset-password-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUserDto } from '../auth-dto/auth-user-dto';
import { EmailResendingDto } from '../auth-dto/email-resending-dto';
import { ConfirmationCodeDto } from '../auth-dto/confirmation-code-dto';

@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private authQueryRepository: AuthQueryRepository,
    ) { }
    @Post('/registration')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileInterceptor('image'))
    async registrationController(@Body() body: CreateUserInputDto, @UploadedFile() image?: Multer.File | undefined): Promise<{ done: boolean; data: {id: string, code: string}; code: number; serviceMessage: string; }> {
        // console.log('registrationController: registrationController - body 👽 😡 👽', body)
        const avatar = image ? image : null
        return this.authService.registrationService(
            body,
            avatar
        );
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
        @Body() authDto: AuthUserDto,
        @ExtractUserFromRequest() user: UserContextDto,
        @ExtractDeviceInfo() deviceInfo: DeviceInfo): Promise<{ accessToken: string, refreshToken: string }> {
        // console.log('AuthController: login - user 😡 REQ', user)
        // console.log('AuthController: login - deviceInfo 😡 REQ', deviceInfo)
        const { remember } = authDto;
        // console.log('AuthController: login - remember 😡 REQ', remember)

        const { accessToken, refreshToken } = await this.authService.loginService(
            deviceInfo.ip,
            deviceInfo.title,
            user.id,
            authDto.remember,
            deviceInfo.refreshToken as string
        );
        // console.log('AuthController: login - accessToken, refreshToken 😡 RES', accessToken, refreshToken)
        return {
            accessToken,
            refreshToken
        }
    }
    @ApiBearerAuth()
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
        // console.log('logoutController: isLogout 👽👽😡👽👽 RES', isLogout)
        return isLogout
    }
    @ApiBearerAuth()
    @Get('/me')
    @HttpCode(HTTP_STATUSES.OK_200)
    @UseGuards(AuthAccessGuard)
    async meController(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
        // console.log('AuthController: me - user 👽😡👽 ', user)
        return this.authQueryRepository.me(user.id);
    }
    @ApiResponse({ status: 204, description: 'Повторная отправка для активации аккаунта!' })
    @Post('/registration-email-resending')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async registrationEmailResendingController(@Body() body: EmailResendingDto): Promise<{ done: boolean, data: {expirationISO: string, code: string} | null, code: number, serviceMessage: string }> {
        // console.log('AuthController: registrationEmailResendingController - body.email 😡 ', body.email)
        return await this.authService.registrationEmailResendingService(body.email)
    }
    @Redirect(process.env.CLIENT_URL, 3000) // Указываем дефолтный URL для редиректа
    @Post('/registration-confirmation')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async registrationСonfirmationController(@Body() body: ConfirmationCodeDto) {
        // console.log('AuthController: registrationСonfirmationController - body.code 😡 ', body.code)
        const isActivated = await this.authService.confirmationCodeRegistrationService(body.code);
        if (isActivated === true) {
            // return { url: process.env.API_URL } // URL для перенаправления
            return { url: process.env.CLIENT_URL }; // URL для перенаправления
        }
    }
    @ApiResponse({ status: 204, description: 'Отправка письма для сбросса пароля!' })
    @Post('/password-recovery')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async passwordRecoverySendEmailController(@Body() body: EmailResendingDto) {
        // console.log('AuthController: passwordRecoverySendEmailController 👽👽😡👽👽 body.email', body.email)
        const isSend = await this.authService.passwordRecoverySendEmailService(body.email)
        // console.log('AuthController: passwordRecoverySendEmailController 👽👽😡👽👽 isSend', isSend)
        return isSend
    }
    @ApiResponse({ status: 204, description: 'Ожидаем новый пароль и код подтверждения для обновления пароля!' })
    @Post('/new-password')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async ressetPasswordController(@Body() body: RessetPasswordDto) {
        // console.log('AuthController: ressetPasswordController - body 😡 ', body)
        return await this.authService.ressetPasswordService(body.newPassword, body.recoveryCode)
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
                createdAt: null,
                avatar: null,
                // name: null,
                // surname: null,
                // isBot: false
                // firstName: null,
                // lastName: null,
            };
        }
    }
}