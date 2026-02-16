import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../posts-infrastructure/posts.repository';

export class DeletePostCommand {
    constructor(
        public id: string
    ) { }
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase
    implements ICommandHandler<DeletePostCommand, void> {
    constructor(
        private postsRepository: PostsRepository,
    ) { }
    async execute(command: DeletePostCommand): Promise<void> {
        const { id } = command;

        const post = await this.postsRepository.findPostOrNotFoundFail(id);
        post.makeDeleted();
        await this.postsRepository.save(post);
    }
}