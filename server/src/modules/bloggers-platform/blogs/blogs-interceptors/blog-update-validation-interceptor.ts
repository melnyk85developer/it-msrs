import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ErRes } from "src/shared/utils/ErRes";
import { INTERNAL_STATUS_CODE } from "src/shared/utils/utils";
import { BlogsRepository } from "../blogs-infrastructure/blogs.repository";

@Injectable()
export class ValidationUpdateBlogInterceptor implements NestInterceptor {
    constructor(
        private readonly blogsRepository: BlogsRepository
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { name, description, websiteUrl } = req.body;
        const id = req.params.id
        // console.log('ValidationUpdateBlogInterceptor: id 😡 ', id)
        // console.log('ValidationUpdateBlogInterceptor: req.params 😡 ', req.params)

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
        if (!id || typeof id !== 'string' || id.trim().length < 1 || id.trim().length > 60) {
            errors.push({ message: 'id говняный 😡', field: 'ValidationUpdateBlogInterceptor' });
        }

        if (errors.length > 0) {
            // console.log('BadRequestException: UpdateBlogInterceptor - errors 😡', errors)
            throw new BadRequestException({ errorsMessages: errors });
        }
        // console.log('ValidationUpdateBlogInterceptor: - id 😡', id)
        const isBlog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(id);
        // console.log('ValidationUpdateBlogInterceptor: - isBlog 😡', !!isBlog)
        return next.handle();
    }
}