import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../../blogs-dto/create-blog.dto';
import { BlogsRepository } from '../../blogs-infrastructure/blogs.repository';

export class UpdateBlogCommand {
    constructor(
        public id: string,
        public dto: UpdateBlogDto,
        public image?: Multer.File | null
    ) { }
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
    implements ICommandHandler<UpdateBlogCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private blogsRepository: BlogsRepository
    ) { }
    async execute(command: UpdateBlogCommand): Promise<string> {
        const { id, dto, image } = command;

        const blog = await this.blogsRepository.findBlogOrNotFoundFailRepository(id);
        blog.updateBlogData(dto);
        // console.log('BlogsService: updateBlogService - blog 😡 ', blog)
        await this.blogsRepository.save(blog);
        return blog._id.toString();
    }
}