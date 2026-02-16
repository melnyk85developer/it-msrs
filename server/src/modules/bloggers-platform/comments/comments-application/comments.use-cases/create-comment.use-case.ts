import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, type CommentModelType } from '../../comments-domain/comments.entity';
import { CommentsRepository } from '../../comments-infrastructure/comments.repository';
import { CreateCommentDto } from '../../comments-dto/create-comments.dto';

export class CreateCommentCommand {
    constructor(
        public userId: string,
        public dto: Omit<CreateCommentDto, 'commentatorInfo'>, 
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
        private commentsRepository: CommentsRepository
    ) { }
    async execute(command: CreateCommentCommand): Promise<string> {
        const { userId, dto, image } = command;
        const commentData = {
            ...dto,
            commentatorInfo: {
                userId: '123',
                userLogin: 'MrRobot'
            }
        }
        const comment = this.CommentModel.createCommentInstance(commentData);
        await this.commentsRepository.save(comment);
        return comment._id.toString();
    }
}