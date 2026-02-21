import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../../blogs-dto/create-blog.dto';
import { BlogsRepository } from '../../blogs-infrastructure/blogs.repository';

export class UpdateBlogCommand {
    constructor(
        public id: string,
        public dto: Omit<UpdateBlogDto, 'id' | 'userId' | 'isMembership'>,
        public userId: string,
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
        const { id, userId, dto, image } = command;
        // console.log('UpdateBlogUseCase: - dto 😡 ', dto)
        const blog = await this.blogsRepository.findBlogOrNotFoundFailRepository(id);
        // console.log('UpdateBlogUseCase: - blog 😡 1', blog)
        blog.updateBlogData({
            ...dto,
            id,
            userId,
            isMembership: false
        });
        // console.log('UpdateBlogUseCase: - blog 😡 2', blog)
        await this.blogsRepository.save(blog);
        // console.log('UpdateBlogUseCase: - blog 😡 3', blog)
        return blog._id.toString();
    }
}