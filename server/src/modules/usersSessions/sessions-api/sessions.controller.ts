import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { SessionService } from '../sessions-application/sessions.service';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { AuthRefreshGuard } from '../../user.accounts/users-guards/refreshTokenGuard';
import { ExtractUserIfExistsFromRequest } from '../../user.accounts/users-guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { UserContextDto } from '../../user.accounts/users-guards/dto/user-context.dto';
import { UsersRepository } from '../../user.accounts/users-infrastructure/users.repository';
import { AuthAccessGuard } from '../../user.accounts/users-guards/bearer/jwt-auth.guard';
import { type DeviceInfo, ExtractDeviceInfo } from '../../user.accounts/users-guards/decorators/param/extract-device-info.decorator';
import { ExtractRefreshPayload } from '../../user.accounts/users-guards/decorators/extract-refresh-payload.decorator';
import { SessionQueryRepository } from '../sessions-infrastructure/sessions.query-repository';
import { SessionDocument } from '../sessions-domain/sessions.entity';
import { GetSessionsQueryParams } from '../sessions-dto/get-sessions-query-params.input-dto';
import { SessionViewDto } from '../sessions-dto/sessions.view-dto';

@Controller('/security')
export class SessionController {
    constructor(
        private sessionsQueryRepository: SessionQueryRepository,
        private usersSessionService: SessionService,
    ) { }

    @ApiOperation({ summary: 'Получить все сессии пользователя!' })
    @ApiResponse({ status: 200 })
    @UseGuards(AuthAccessGuard)
    // @UseGuards(AuthRefreshGuard)
    @Get('/devices')
    @HttpCode(HTTP_STATUSES.OK_200)
    async getallDevicesByUserIdController(@Query() query: GetSessionsQueryParams, @ExtractUserIfExistsFromRequest() user: UserContextDto): Promise<PaginatedViewDto<SessionViewDto[]>> {
        // console.log('SecurityDevicesQueryRepository: - user 😡 ', user)
        const allDevices = await this.sessionsQueryRepository.allDevicesOneUserQueryRepository(query, user.id);
        // console.log('SecurityDevicesQueryRepository: - allDevices 😡 ', allDevices)
        return allDevices
    }
    @ApiOperation({ summary: 'Удалить сессию по deviceId!' })
    @ApiResponse({ status: 204 })
    @UseGuards(AuthAccessGuard)
    @Delete(`/devices/:deviceId`)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteSessionByDeviceIdController(@Param('deviceId') deviceId: string, @ExtractUserIfExistsFromRequest() user: UserContextDto) {
        console.log('SecurityDevicesQueryRepository: - deviceId 😡 ', deviceId)
        const isDeleteSession = await this.usersSessionService.deleteSessionsByDeviceIdServices(
            user.id,
            deviceId,
        );
        // console.log('SecurityDevicesQueryRepository: - deviceId 😡 ', deviceId)
        return isDeleteSession
    }
    @ApiOperation({ summary: 'Удалить все сессии кроме текущей!' })
    @ApiResponse({ status: 204 })
    @UseGuards(AuthAccessGuard)
    @UseGuards(AuthRefreshGuard)
    @Delete('/devices')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteAllSessionByUserIdController(
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
        @ExtractDeviceInfo() deviceInfo: DeviceInfo, @ExtractRefreshPayload() refreshTokenPayload: any
    ) {
        // console.log('deleteAllSessionByUserIdController: - refreshTokenPayload 😡 ', refreshTokenPayload)
        // console.log('deleteAllSessionByUserIdController: - deviceInfo.refreshToken 😡 ', deviceInfo.refreshToken)
        return await this.usersSessionService.deleteAllSessionsServices(
            user.id,
            refreshTokenPayload.deviceId,
            deviceInfo.refreshToken as string
        );
    }
}