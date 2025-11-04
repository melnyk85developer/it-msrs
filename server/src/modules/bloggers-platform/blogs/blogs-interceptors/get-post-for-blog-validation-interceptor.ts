import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { BlogsRepository } from "../blogs-infrastructure/blogs.repository";

@Injectable()
export class ValidationGetPostForBlogInterceptor implements NestInterceptor {
    constructor(
        private readonly blogsRepository: BlogsRepository
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { blogId } = req.params

        // console.log('GetPostForBlogInterceptor: req.params.blogId 😡 ', blogId)

        const errors: { message: string; field: string }[] = [];

        if (!blogId || typeof blogId !== 'string' || blogId.trim().length < 1 || blogId.trim().length > 60) {
            errors.push({ message: 'blogId говняный 😡', field: 'blogId' });
        }

        if (errors.length > 0) {
            console.log('BadRequestException: GetPostForBlogInterceptor - errors 😡 ', errors)
            throw new BadRequestException({ errorsMessages: errors });
        }
        // console.log('GetPostForBlogInterceptor: - blogId 😡', blogId)
        const isBlog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(blogId);
        // console.log('GetPostForBlogInterceptor: - isBlog 😡', !!isBlog)
        return next.handle();
    }
}