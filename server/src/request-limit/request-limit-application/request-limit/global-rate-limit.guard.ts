import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import moment from "moment";
import { Request, Response } from 'express';
import { SETTINGS } from "src/core/settings";
import { TokenService } from "src/modules/tokens/tokens-application/token-service";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { HTTP_STATUSES } from "src/core/utils/utils";
import { GlobalRateLimitRepository } from "src/request-limit/request-limit-infrastructure/request-limit.repository";
import { CommandBus } from "@nestjs/cqrs";
import { GlobalRateLimitCommand } from "./create-global-rate-limit.use-case";

@Injectable()
export class GlobalRateLimitGuard implements CanActivate {
    constructor(
        // @InjectModel(GlobalRateLimit.name)
        private readonly commandBus: CommandBus,
        private readonly tokenService: TokenService,
        private readonly globalRateLimitRepository: GlobalRateLimitRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (process.env.NODE_ENV === 'testing') {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        if (!request.originalUrl.startsWith('/auth')) {
            return true;
        }

        const refreshToken = request.cookies?.refreshToken;

        // if (!request.ip) {
        //     throw new DomainException(HTTP_STATUSES.BAD_REQUEST_400, 'IP адрес не найден в запросе');
        // }

        // if (refreshToken) {
        //     try {
        //         const userToken = await this.tokenService.validateRefreshToken(refreshToken);
        //         if (userToken?.userId) {
        //             return true;
        //         }
        //     } catch { }
        // }

        const currentDate = new Date();

        const tenSecondsAgo = moment(currentDate)
            .subtract(SETTINGS.TIME_WINDOW, 'milliseconds')
            .toDate();

        const filter = {
            IP: request.ip,
            URL: request.originalUrl,
            date: { $gte: tenSecondsAgo },
        };

        const count = await this.globalRateLimitRepository.findCountDocuments(filter);

        if (count >= Number(SETTINGS.MAX_REQUESTS)) {
            console.log(`IP: ${request.ip}, URL: ${request.originalUrl}, запросов: ${count}`);
            console.log(`Превышен лимит скорости в globalRequestLimitMiddleware для IP: ${request.ip}, URL: ${request.originalUrl}`)
            throw new DomainException(HTTP_STATUSES.TOO_MANY_REQUESTS)
        }

        await this.commandBus.execute<GlobalRateLimitCommand, string>(
            new GlobalRateLimitCommand({
                IP: request.ip ?? 'unknown',
                URL: request.originalUrl ?? 'unknown',
                date: currentDate,
            }),
        );

        return true;
    }
}