import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../blogs-infrastructure/blogs.repository';

export class DeleteBlogCommand {
    constructor(
        public id: string
    ) { }
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase
    implements ICommandHandler<DeleteBlogCommand, void> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private blogsRepository: BlogsRepository
    ) { }
    async execute(command: DeleteBlogCommand): Promise<void> {
        const { id } = command;

        const blog = await this.blogsRepository.findBlogOrNotFoundFailRepository(id);
        blog.makeDeleted();
        await this.blogsRepository.save(blog);
    }
}