import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../comments-infrastructure/comments.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

export class DeleteCommentCommand {
    constructor(
        public id: string,
        public userId: string
    ) { }
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
    implements ICommandHandler<DeleteCommentCommand, void> {
    constructor(
        private commentsRepository: CommentsRepository
    ) { }
    async execute(command: DeleteCommentCommand): Promise<void> {
        const { id, userId } = command;
        const comment = await this.commentsRepository.findCommentOrNotFoundFailRepository(id);
        if(comment.commentatorInfo.userId !== userId){
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_POST)
        }
        comment.makeDeleted();
        await this.commentsRepository.save(comment);
    }
}