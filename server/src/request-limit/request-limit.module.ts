import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalRateLimitGuard } from './request-limit-application/request-limit/global-rate-limit.guard';
import { GlobalRateLimitRepository } from './request-limit-infrastructure/request-limit.repository';
import { GlobalRateLimit, GlobalRateLimitSchema } from './request-limit-domain/request-limit.entity';
import { GlobalRateLimitUseCase } from './request-limit-application/request-limit/create-global-rate-limit.use-case';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TokenModule } from 'src/modules/tokens/token.module';

const useCases = [
    GlobalRateLimitUseCase,

    GlobalRateLimitGuard,
    GlobalRateLimitRepository,
]

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: GlobalRateLimit.name,
                schema: GlobalRateLimitSchema,
            },
        ]),
        CqrsModule,
        TokenModule
    ],
    providers: [
        ...useCases,
        {
            provide: APP_GUARD,
            useClass: GlobalRateLimitGuard,
        },
    ],
    exports: [
        ...useCases
    ],
})
export class RequestLimitModule { }