import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ErRes } from "src/shared/utils/ErRes";
import { INTERNAL_STATUS_CODE } from "src/shared/utils/utils";
import { BlogsRepository } from "../../blogs/blogs-infrastructure/blogs.repository";
import { PostsRepository } from "../../posts/posts-infrastructure/posts.repository";

@Injectable()
export class ValidationCreateCommentInterceptor implements NestInterceptor {
    constructor(
        private readonly postsRepository: PostsRepository
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { content } = req.body;
        const { postId } = req.params;
        // console.log('ValidationCreateCommentInterceptor: title, shortDescription, content, blogId, blogName 😡 ', title, shortDescription, content, blogId)

        const errors: { message: string; field: string }[] = [];

        if (!content || typeof content !== 'string' || content.trim().length < 3 || content.trim().length > 60) {
            errors.push({ message: 'content говняный 😡', field: 'content' });
        }
        if (!postId || typeof postId !== 'string' || postId.trim().length < 3 || postId.trim().length > 60) {
            errors.push({ message: 'blogId говняный 😡', field: 'blogId' });
        }
        if (errors.length > 0) {
            // console.log('BadRequestException: CreateCommentInterceptor - errors 😡 ', errors)
            throw new BadRequestException({ errorsMessages: errors });
        }
        // console.log('ValidationCreateCommentInterceptor: - postId 😡', postId)
        const isBlog = await this.postsRepository.findPostOrNotFoundFail(postId);
        // console.log('ValidationCreateCommentInterceptor: - isBlog 😡', !!isBlog)
        return next.handle();
    }
}