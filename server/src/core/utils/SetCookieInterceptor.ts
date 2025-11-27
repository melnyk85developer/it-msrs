import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();

        return next.handle().pipe(
            tap((data) => {
                // Ожидаем, что AuthService вернет объект с accessToken и refreshToken
                if (data && data.refreshToken) {
                    response.cookie('refreshToken', data.refreshToken, {
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                        httpOnly: true,
                        secure: true, // Рекомендуется, если не на http
                    });
                    // Очищаем Refresh Token, чтобы он не ушел в теле ответа
                    delete data.refreshToken;
                }
            }),
        );
    }
}
