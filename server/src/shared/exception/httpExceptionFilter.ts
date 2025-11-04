import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();
        const status = exception.getStatus();

        const exceptionResponse = exception.getResponse();
        const message = typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message;

        const field = (exceptionResponse as any).field;

        console.log('🌐 [HttpExceptionFilter] → Отдаём ошибку:', {
            statusCode: status,
            message,
            field
        });

        response.status(status).json({
            statusCode: status,
            message,
            ...(field ? { field } : {})
        });
    }
}