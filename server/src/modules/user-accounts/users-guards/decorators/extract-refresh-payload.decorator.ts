import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractRefreshPayload = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        // 🛑 Извлекаем данные, которые сохранил AuthRefreshGuard
        // console.log('ExtractRefreshPayload: request.refreshTokenPayload - 👽👽👽', request.refreshTokenPayload)
        return request.refreshTokenPayload;
    },
);