import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ErRes } from "src/shared/utils/ErRes";
import { INTERNAL_STATUS_CODE } from "src/shared/utils/utils";
import { PostsRepository } from "../posts-infrastructure/posts.repository";
import { BlogsRepository } from "../../blogs/blogs-infrastructure/blogs.repository";

@Injectable()
export class ValidationUpdatePostInterceptor implements NestInterceptor {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly blogsRepository: BlogsRepository
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { title, shortDescription, content, blogId } = req.body;
        const { id } = req.params;

        // console.log('ValidationUpdatePostInterceptor: - req.params id 😡', id)

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
        if (!blogId || typeof blogId !== 'string' || blogId.trim().length < 3 || blogId.trim().length > 60) {
            errors.push({ message: 'blogId говняный 😡', field: 'blogId' });
        }
        if (!id || typeof id !== 'string' || id.trim().length < 3 || id.trim().length > 60) {
            errors.push({ message: 'id говняный 😡', field: 'id' });
        }
        if (errors.length > 0) {
            // console.log('BadRequestException: UpdatePostInterceptor - errors 😡', errors)
            throw new BadRequestException({ errorsMessages: errors });
        }
        // console.log('ValidationUpdatePostInterceptor: - blogId 😡', blogId)
        const isBlog = await this.blogsRepository.findBlogOrNotFoundFailBlogsRepository(blogId);
        // console.log('ValidationUpdatePostInterceptor: - !isBlog 😡', !isBlog)
        // console.log('ValidationUpdatePostInterceptor: - id 😡', id)
        const isPost = await this.postsRepository.findPostOrNotFoundFail(id);
        // console.log('ValidationUpdatePostInterceptor: - isPost 😡', !!isPost)
        return next.handle();
    }
}