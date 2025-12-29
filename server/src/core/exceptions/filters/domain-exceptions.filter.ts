import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from '../domain-exceptions';
import { DomainExceptionCode } from '../domain-exception-codes';
import { ErrorResponseBody } from './error-response-body.type';

//https://docs.nestjs.com/exception-filters#exception-filters-1
//Ошибки класса DomainException (instanceof DomainException)
@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // !!! ИСПОЛЬЗУЕМ ГОТОВЫЙ СТАТУС 400 ИЗ ИСКЛЮЧЕНИЯ !!!
        const status = exception.httpStatus;

        // !!! ДИАГНОСТИЧЕСКИЙ ЛОГ (Убедитесь, что тут 400)
        // console.log(`DomainFilter: Final Status 😡 ${status}. Code: ${exception.code}`);

        const responseBody = this.buildResponseBody(exception, request.url);

        response.status(status).json(responseBody);
    }

    private buildResponseBody(
        exception: DomainException,
        requestUrl: string,
    ): ErrorResponseBody {
        return {
            // timestamp: new Date().toISOString(),
            // path: requestUrl,
            // message: exception.message,
            // code: exception.code,
            errorsMessages: exception.extensions,
            // field: exception.field, // Этот лог сработал
        };
    }
}