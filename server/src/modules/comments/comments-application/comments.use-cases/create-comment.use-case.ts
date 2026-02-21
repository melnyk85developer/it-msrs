import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, type CommentModelType } from '../../comments-domain/comments.entity';
import { CommentsRepository } from '../../comments-infrastructure/comments.repository';
import { CreateCommentDto } from '../../comments-dto/create-comments.dto';
import { PostsRepository } from 'src/modules/bloggers-platform/posts/posts-infrastructure/posts.repository';
import { UsersRepository } from 'src/modules/user-accounts/users-infrastructure/users.repository';

export class CreateCommentCommand {
    constructor(
        public userId: string,
        public postId: string,
        public content: string,
        public image?: Multer.File | null
    ) { }
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
    implements ICommandHandler<CreateCommentCommand, string> {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private commentsRepository: CommentsRepository,
        private postsRepository: PostsRepository,
        private usersRepository: UsersRepository,
    ) { }
    async execute(command: CreateCommentCommand): Promise<string> {
        const { userId, postId, content, image } = command;
        await this.postsRepository.findPostOrNotFoundFail(postId);
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        const commentData = {
            postId,
            content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.accountData.login
            }
        }
        const comment = this.CommentModel.createCommentInstance(commentData);
        await this.commentsRepository.save(comment);
        return comment._id.toString();
    }
}