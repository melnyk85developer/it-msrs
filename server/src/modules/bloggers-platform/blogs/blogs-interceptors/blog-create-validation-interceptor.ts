import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ErRes } from "src/shared/utils/ErRes";
import { INTERNAL_STATUS_CODE } from "src/shared/utils/utils";

@Injectable()
export class ValidationCreateBlogInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { name, description, websiteUrl } = req.body;

        // console.log('ValidationCreateBlogInterceptor: name 😡 ', name)
        // console.log('ValidationCreateBlogInterceptor: description 😡 ', description)
        // console.log('ValidationCreateBlogInterceptor: websiteUrl 😡 ', websiteUrl)
        // console.log('ValidationCreateBlogInterceptor: req.params 😡 ', req.params)
        // console.log('ValidationCreateBlogInterceptor: req.query 😡 ', req.query)

        const errors: { message: string; field: string }[] = [];

        if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 50) {
            errors.push({ message: 'name говняный 😡', field: 'name' });
        }
        if (!description || typeof description !== 'string' || description.trim().length < 3 || description.trim().length > 50) {
            errors.push({ message: 'description говняный 😡', field: 'description' });
        }
        if (!websiteUrl || typeof websiteUrl !== 'string' || websiteUrl.trim().length < 3 || websiteUrl.trim().length > 50) {
            errors.push({ message: 'websiteUrl говняный 😡', field: 'websiteUrl' });
        }

        if (errors.length > 0) {
            // console.log('BadRequestException: CreateBlogInterceptor - errors 😡 ', errors)
            throw new BadRequestException({ errorsMessages: errors });
        }
        return next.handle();
    }
}