import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ErRes } from "src/shared/utils/ErRes";
import { INTERNAL_STATUS_CODE } from "src/shared/utils/utils";
import { BlogsRepository } from "../blogs-infrastructure/blogs.repository";

@Injectable()
export class ValidationDeleteBlogInterceptor implements NestInterceptor {
    constructor(
        private readonly blogsRepository: BlogsRepository
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const id = req.params.id;

        const errors: { message: string; field: string }[] = [];

        if (!id || typeof id !== 'string' || id.trim().length < 1 || id.trim().length > 60) {
            errors.push({ message: 'id говняный 😡', field: 'ValidationDeleteBlogInterceptor' });
        }

        if (errors.length > 0) {
            console.log('BadRequestException: DeleteBlogInterceptor - errors 😡', errors)
            throw new BadRequestException({ errorsMessages: errors });
        }
        // console.log('ValidationDeleteBlogInterceptor: - id 😡', id)
        const isBlog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(id);
        // console.log('ValidationDeleteBlogInterceptor: - isBlog 😡', !!isBlog)
        return next.handle();
    }
}