import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../comments-infrastructure/comments.repository';

export class DeleteCommentCommand {
    constructor(
        public id: string
    ) { }
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
    implements ICommandHandler<DeleteCommentCommand, void> {
    constructor(
        private commentsRepository: CommentsRepository
    ) { }
    async execute(command: DeleteCommentCommand): Promise<void> {
        const { id } = command;
        const comment = await this.commentsRepository.findCommentOrNotFoundFailRepository(id);
        comment.makeDeleted();
        await this.commentsRepository.save(comment);
    }
}