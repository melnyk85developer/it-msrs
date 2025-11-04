import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ErRes } from "src/shared/utils/ErRes";
import { INTERNAL_STATUS_CODE } from "src/shared/utils/utils";
import { BlogsRepository } from "../../blogs/blogs-infrastructure/blogs.repository";
import { PostsRepository } from "../../posts/posts-infrastructure/posts.repository";
import { CommentsRepository } from "../comments-infrastructure/comments.repository";

@Injectable()
export class ValidationUpdateCommentInterceptor implements NestInterceptor {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly commentsRepository: CommentsRepository
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { content, postId } = req.body;
        const { commentId } = req.params;
        // console.log('ValidationUpdateCommentInterceptor: content😡 ', content)
        // console.log('ValidationUpdateCommentInterceptor: postId 😡 ', postId)
        // console.log('ValidationUpdateCommentInterceptor: commentId 😡 ', commentId)
        
        const errors: { message: string; field: string }[] = [];

        if (!content || typeof content !== 'string' || content.trim().length < 3 || content.trim().length > 60) {
            // console.log('ValidationUpdateCommentInterceptor: content 😡 ', content)
            errors.push({ message: 'content говняный 😡', field: 'content' });
        }
        if (!commentId || typeof commentId !== 'string' || commentId.trim().length < 3 || commentId.trim().length > 60) {
            // console.log('ValidationUpdateCommentInterceptor: blogId 😡 ', blogId)
            errors.push({ message: 'blogId говняный 😡', field: 'blogId' });
        }

        if (errors.length > 0) {
            throw new BadRequestException({ errorsMessages: errors });
        }
        const isPost = await this.postsRepository.findPostOrNotFoundFail(postId);
        // console.log('ValidationUpdateCommentInterceptor: - isPost 😡', isPost)
        const isComment = await this.commentsRepository.findCommentOrNotFoundFailRepository(commentId);
        // console.log('ValidationUpdateCommentInterceptor: - isComment 😡', isComment)
        return next.handle();
    }
}