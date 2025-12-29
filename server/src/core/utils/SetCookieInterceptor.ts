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
                // Устанавливаем куку после успешного выполнения метода
                if (data && data.refreshToken) {
                    // console.log('SetCookieInterceptor: data.refreshToken - 👽👽👽', data.refreshToken)
                    response.cookie('refreshToken', data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                }
            }),
        );
    }
}
