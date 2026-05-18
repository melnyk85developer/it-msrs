import { Body, Controller, Post, UseGuards, Get, HttpCode, HttpStatus, UseInterceptors, Redirect, Param, Put, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Multer } from 'multer';
import { LocalAuthGuard } from '../../user-accounts/users-guards/local/local-auth.guard';
import { ExtractUserFromRequest } from '../../user-accounts/users-guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../user-accounts/users-guards/dto/user-context.dto';
import { AuthAccessGuard } from '../../user-accounts/users-guards/bearer/jwt-auth.guard';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { SetCookieInterceptor } from 'src/core/utils/SetCookieInterceptor';
import { type DeviceInfo, ExtractDeviceInfo } from '../../user-accounts/users-guards/decorators/param/extract-device-info.decorator';
import { AuthRefreshGuard } from '../../user-accounts/users-guards/refreshTokenGuard';
import { ExtractRefreshPayload } from '../../user-accounts/users-guards/decorators/extract-refresh-payload.decorator';
import { ClearCookieInterceptor } from '../../user-accounts/users-interceptors/clear-cookie.interceptor';
import { CreateUserInputDto } from '../../user-accounts/users-dto/users.input-dto';
import { AuthQueryRepository } from '../../user-accounts/users-infrastructure/auth.query-repository';
import { RessetPasswordInputDto } from 'src/modules/user-accounts/users-dto/resset-password-input-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUserDto } from '../auth-dto/auth-user-dto';
import { EmailResendingDto } from '../auth-dto/email-resending-dto';
import { ConfirmationCodeDto } from '../auth-dto/confirmation-code-dto';
import { User } from 'src/modules/user-accounts/users-domain/user.entity';
import { CommandBus } from '@nestjs/cqrs';
import { UserRegistrationCommand, UserRegistrationResult } from '../auth-application/auth-use-cases/registration-use-case';
import { UserLoginCommand, UserLoginResult } from '../auth-application/auth-use-cases/login-use-case';
import { RefreshTokenCommand, RefreshTokenResult } from '../auth-application/auth-use-cases/refresh-token.use-case.ts';
import { type RefreshTokenPayloadType } from '../auth-dto/refresh-token-payload.dto';
import { UserLogoutCommand } from '../auth-application/auth-use-cases/logout-use-case';
import { RegistrationEmailResendingCommand, RegistrationEmailResendingResult } from '../auth-application/auth-use-cases/registration-email-resending-use-case';
import { ConfirmationCodeRegistrationCommand, ConfirmationCodeRegistrationResult } from '../../confirmationsCodes/confirmations-application/confirmation-use-cases/confirmation-code-registration-use-case';
import { SendPasswordRecoveryEmailCommand, SendPasswordRecoveryEmailResult } from 'src/modules/user-accounts/users-application/user-use-cases/sendPasswordRecoveryEmailUseCase';
import { UpdatePasswordCommand, UpdatePasswordResult } from 'src/modules/user-accounts/users-application/user-use-cases/updatePasswordUseCase';
import { MeViewDto } from '../auth-dto/me.view-dto';

@Controller('/auth')
export class AuthController {
    constructor(
        private commandBus: CommandBus,
        private authQueryRepository: AuthQueryRepository,
    ) { }
    @ApiOperation({ summary: 'Регистрация пользователя!' })
    @ApiResponse({ status: 204, type: [User] })
    @Post('/registration')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @UseInterceptors(FileInterceptor('image'))
    async registrationController(
        @Body() body: CreateUserInputDto,
        @UploadedFile() image?: Multer.File | undefined
    ): Promise<UserRegistrationResult> {
        // console.log('registrationController: registrationController - body 👽 😡 👽', body)
        const avatar = image ? image : null
        return await this.commandBus.execute<UserRegistrationCommand, UserRegistrationResult>(
            new UserRegistrationCommand(body, avatar),
        );
    }
    @ApiOperation({ summary: 'Авторизация пользователя!' })
    @ApiResponse({ status: 200, type: [User] })
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
        @ExtractDeviceInfo() deviceInfo: DeviceInfo
    ): Promise<{ accessToken: string, refreshToken: string }> {
        // console.log('AuthController: login - user 😡 REQ', user)
        // console.log('AuthController: login - deviceInfo 😡 REQ', deviceInfo)
        return await this.commandBus.execute<UserLoginCommand, UserLoginResult>(
            new UserLoginCommand(
                {
                    ip: deviceInfo.ip,
                    userAgent: deviceInfo.title,
                    userId: user.id,
                    remember: authDto.remember,
                    refreshToken: deviceInfo.refreshToken
                }
            ),
        );
    }
    @ApiOperation({ summary: 'Обновление refresh-token!' })
    @ApiResponse({ status: 201, type: [User] })
    @ApiBearerAuth()
    @UseGuards(AuthRefreshGuard)
    @UseInterceptors(SetCookieInterceptor)
    @Post('/refresh-token')
    @HttpCode(HTTP_STATUSES.CREATED_201)
    async refreshController(
        @ExtractDeviceInfo() deviceInfo: DeviceInfo,
        @ExtractRefreshPayload() refreshTokenPayload: RefreshTokenPayloadType
    ): Promise<{ accessToken: string, refreshToken: string }> {
        // console.log('refreshController: refreshTokenPayload - 👽👽👽', refreshTokenPayload)
        return await this.commandBus.execute<RefreshTokenCommand, RefreshTokenResult>(
            new RefreshTokenCommand(
                {
                    ip: deviceInfo.ip,
                    userAgent: deviceInfo.title,
                    refreshTokenPayload: refreshTokenPayload,
                    refreshToken: deviceInfo.refreshToken
                }
            )
        );
    }
    @ApiOperation({ summary: 'logout - выйти из аккаунта и онулировать авторизацию!' })
    @ApiResponse({ status: 201, type: [User] })
    @ApiBearerAuth()
    @UseGuards(AuthRefreshGuard)
    @UseInterceptors(ClearCookieInterceptor)
    @Post('/logout')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async logoutController(
        @ExtractDeviceInfo() deviceInfo: DeviceInfo,
        @ExtractRefreshPayload() refreshTokenPayload: RefreshTokenPayloadType
    ) {
        return await this.commandBus.execute<UserLogoutCommand, UserLoginResult>(
            new UserLogoutCommand(
                {
                    refreshToken: deviceInfo.refreshToken,
                    refreshTokenPayload: refreshTokenPayload
                }
            ),
        );
    }
    @ApiOperation({ summary: 'Получить информацию о текущем пользователе!' })
    @ApiResponse({ status: 201, type: [User] })
    @ApiBearerAuth()
    @Get('/me')
    @HttpCode(HTTP_STATUSES.OK_200)
    @UseGuards(AuthAccessGuard)
    async meController(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
        // console.log('AuthController: me - user 👽😡👽 ', user)
        return this.authQueryRepository.me(user.id);
    }
    @ApiOperation({ summary: 'Повторная отправка сообщения на Еmail для активации аккаунта!' })
    @ApiResponse({ status: 204, type: [User] })
    @Post('/registration-email-resending')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async registrationEmailResendingController(
        @Body() body: EmailResendingDto
    ): Promise<RegistrationEmailResendingResult> {
        // console.log('AuthController: registrationEmailResendingController - body.email 😡 ', body.email)
        return await this.commandBus.execute<RegistrationEmailResendingCommand, RegistrationEmailResendingResult>(
            new RegistrationEmailResendingCommand(body.email)
        );
    }
    @ApiOperation({ summary: 'Проверка кода активации аккаунта!' })
    @ApiResponse({ status: 204, type: [User] })
    @Redirect(process.env.CLIENT_URL, 3000) // Указываем дефолтный URL для редиректа
    @Post('/registration-confirmation')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async registrationСonfirmationController(
        @Body() body: ConfirmationCodeDto
    ): Promise<any> {
        // console.log('AuthController: registrationСonfirmationController - body.code 😡 ', body.code)
        const isActivated = await this.commandBus.execute<ConfirmationCodeRegistrationCommand, ConfirmationCodeRegistrationResult>(
            new ConfirmationCodeRegistrationCommand(body.code)
        );
        if (isActivated.done === true) {
            // return { url: process.env.API_URL } // URL для перенаправления
            return { url: process.env.CLIENT_URL }; // URL для перенаправления
        }
    }
    @ApiOperation({ summary: 'Отправка письма для сбросса пароля!' })
    @ApiResponse({ status: 204, type: [User] })
    @Post('/password-recovery')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async passwordRecoverySendEmailController(@Body() body: EmailResendingDto) {
        // console.log('AuthController: passwordRecoverySendEmailController 👽👽😡👽👽 body.email', body.email)
        return await this.commandBus.execute<SendPasswordRecoveryEmailCommand, SendPasswordRecoveryEmailResult>(
            new SendPasswordRecoveryEmailCommand(body.email)
        );
    }
    @ApiOperation({ summary: 'Ожидаем новый пароль и код подтверждения для обновления пароля!' })
    @ApiResponse({ status: 204, type: [User] })
    @Post('/new-password')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updatePasswordController(@Body() body: RessetPasswordInputDto) {
        // console.log('AuthController: ressetPasswordController - body 😡 ', body)
        return await this.commandBus.execute<UpdatePasswordCommand, UpdatePasswordResult>(
            new UpdatePasswordCommand({
                password: body.newPassword,
                code: body.recoveryCode
            })
        );
    }
}