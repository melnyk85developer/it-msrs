import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../comments-infrastructure/comments.repository';
import { UpdateCommentDto } from '../../comments-dto/create-comments.dto';

export class UpdateCommentCommand {
    constructor(
        public commentId: string,
        public dto: Omit<UpdateCommentDto, 'updatedAt'>
    ) { }
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
    implements ICommandHandler<UpdateCommentCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private commentsRepository: CommentsRepository
    ) { }
    async execute(command: UpdateCommentCommand): Promise<string> {
        const { commentId, dto } = command;
        // console.log('CommentsController: updateCommentController - commentId, dto 😡 ', commentId, dto)
        const comment = await this.commentsRepository.findCommentOrNotFoundFailRepository(commentId);
        // console.log('CommentsController: updateCommentController - comment1 😡 ', comment)
        comment.update(dto);
        // console.log('CommentsController: updateCommentController - comment2 😡 ', comment)
        await this.commentsRepository.save(comment)
        // console.log('CommentsController: updateCommentController - comment3 😡 ', comment)
        return comment._id.toString();
    }
}