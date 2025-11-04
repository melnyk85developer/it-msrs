import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ErRes } from "src/shared/utils/ErRes";
import { INTERNAL_STATUS_CODE } from "src/shared/utils/utils";
import { PostsRepository } from "../posts-infrastructure/posts.repository";
import { BlogsRepository } from "../../blogs/blogs-infrastructure/blogs.repository";

@Injectable()
export class ValidationCreatePostInterceptor implements NestInterceptor {
    constructor(
        private readonly blogsRepository: BlogsRepository
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { title, shortDescription, content, blogId } = req.body;

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
        if (!blogId || typeof blogId !== 'string' || blogId.trim().length < 1 || blogId.trim().length > 60) {
            errors.push({ message: 'blogId говняный 😡', field: 'blogId' });
        }

        if (errors.length > 0) {
            // console.log('BadRequestException: CreatePostInterceptor - errors 😡 ', errors)
            throw new BadRequestException({ errorsMessages: errors });
        }
        // console.log('CreatePostInterceptor: - blogId 😡', blogId)
        const isBlog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(blogId);
        // console.log('CreatePostInterceptor: - isBlog 😡', !!isBlog)
        return next.handle();
    }
}