import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";

@Injectable()
export class SuccessMessageInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const res = context.switchToHttp().getResponse();

        return next.handle().pipe(
            tap((data) => {
                if (data?.serviceMessage) {
                    res.setHeader(
                        'X-Service-Message',
                        encodeURIComponent(data.serviceMessage),
                    );
                }
            }),
        );
    }
}

