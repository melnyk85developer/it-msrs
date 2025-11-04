import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ErRes } from "src/shared/utils/ErRes";
import { INTERNAL_STATUS_CODE } from "src/shared/utils/utils";

@Injectable()
export class ValidationCreateUserInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { login, password, email } = req.body;

        const errors: { message: string; field: string }[] = [];

        if (!login || typeof login !== 'string' || login.trim().length < 3 || login.trim().length > 10) {
            errors.push({ message: 'Login говняный 😡', field: 'login' });
        }

        if (!password || typeof password !== 'string' || password.trim().length < 6 || password.trim().length > 20) {
            errors.push({ message: 'Password говняный 😡', field: 'password' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
            errors.push({ message: 'Email говняный 😡', field: 'email' });
        }

        if (errors.length > 0) {
            throw new BadRequestException({errorsMessages: errors});
        }
        return next.handle();
    }
}