import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { BlogsRepository } from "../blogs-infrastructure/blogs.repository";

@Injectable()
export class ValidationCreatePostForBlogInterceptor implements NestInterceptor {
    constructor(
        private readonly blogsRepository: BlogsRepository
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { title, shortDescription, content } = req.body;
        const { blogId } = req.params

        // console.log('ValidationCreatePostForBlogInterceptor: req.params.blogId 😡 ', blogId)
        // console.log('ValidationCreatePostForBlogInterceptor: req.params 😡 ', req.params)
        // console.log('ValidationCreatePostForBlogInterceptor: req.query 😡 ', req.query)

        const errors: { message: string; field: string }[] = [];

        if (!title || typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 60) {
            errors.push({ message: 'title говняный 😡', field: 'title' });
        }

        if (!shortDescription || typeof shortDescription !== 'string' || shortDescription.trim().length < 3 || shortDescription.trim().length > 60) {
            errors.push({ message: 'shortDescription говняный 😡', field: 'shortDescription' });
        }
        if (!content || typeof content !== 'string' || content.trim().length < 3 || content.trim().length > 60) {
            errors.push({ message: 'content говняный 😡', field: 'content' });
        }
        if (!blogId || typeof blogId !== 'string' || blogId === 'undefined' || blogId.trim().length < 1 || blogId.trim().length > 60) {
            errors.push({ message: 'blogId говняный 😡', field: 'blogId' });
        }

        if (errors.length > 0) {
            console.log('BadRequestException: CreatePostForBlogInterceptor - errors 😡 ', errors)
            throw new BadRequestException({ errorsMessages: errors });
        }
        // console.log('ValidationCreatePostForBlogInterceptor: - blogId 😡', blogId)
        const isBlog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(blogId);
        // console.log('ValidationCreatePostForBlogInterceptor: - isBlog 😡', !!isBlog)
        return next.handle();
    }
}