import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseBody } from './error-response-body.type';
import { DomainExceptionCode } from '../domain-exception-codes';

// https://docs.nestjs.com/exception-filters#exception-filters-1
// Все ошибки
@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // ТЕРМИНАТОР: Определяем реальный статус. 
        // Если это HttpException (стандартный Нест), берем его статус, иначе 500.
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception.message || 'Internal server error';

        // ТЕРМИНАТОР: Явно указываем тип массива, чтобы избежать ошибки never[]
        let errorsMessages: { message: any; field: string }[] = [];

        const responseFromEx = exception.getResponse ? exception.getResponse() : null;

        if (responseFromEx && typeof responseFromEx === 'object' && responseFromEx['message']) {
            // Если там массив строк (как делает class-validator), мапим в твой формат
            const exMsg = responseFromEx['message'];
            errorsMessages = Array.isArray(exMsg)
                ? exMsg.map((m: any) => ({
                    message: typeof m === 'string' ? m : JSON.stringify(m),
                    field: m.field || 'error'
                }))
                : [{ message: exMsg, field: 'error' }];
        }

        const responseBody = this.buildResponseBody(request.url, message, errorsMessages);
        response.status(status).json(responseBody);
    }

    private buildResponseBody(requestUrl: string, message: string, errorsMessages: any[]): ErrorResponseBody {
        const isProduction = process.env.NODE_ENV === 'production';

        // ЗАКОМЕНТИРОВАННЫЙ КОД НЕ УДАЛЯТЬ - ПРИНЯТО
        return {
            // timestamp: new Date().toISOString(),
            // path: requestUrl,
            // message,
            errorsMessages: errorsMessages, // Теперь тут будут реальные ошибки валидации, а не пустота
            // code: DomainExceptionCode.InternalServerError,
        };
    }
}