import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../comments-infrastructure/comments.repository';
import { UpdateCommentDto } from '../../comments-dto/create-comments.dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

export class UpdateCommentCommand {
    constructor(
        public commentId: string,
        public userId: string,
        public content: string
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
        const { commentId, userId, content } = command;
        console.log('CommentsController: updateCommentController - commentId, content 😡 ', commentId, content)
        const comment = await this.commentsRepository.findCommentOrNotFoundFailRepository(commentId);
        console.log('CommentsController: updateCommentController - comment1 😡 ', comment)
        if (comment.commentatorInfo.userId !== userId) {
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_UPDATED_YOU_ARE_NOT_THE_OWNER_OF_THE_POST)
        }
        comment.update({
            id: commentId,
            content
        });
        console.log('CommentsController: updateCommentController - comment2 😡 ', comment)
        await this.commentsRepository.save(comment)
        console.log('CommentsController: updateCommentController - comment3 😡 ', comment)
        return comment._id.toString();
    }
}