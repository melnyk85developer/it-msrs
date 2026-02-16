import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../../blogs-dto/create-blog.dto';
import { BlogsRepository } from '../../blogs-infrastructure/blogs.repository';
import { UpdateHomePageBlogDto } from '../../blogs-api/input-dto-blogs/update-HomePageblog-dto';

export class UpdateBlogHomePageCommand {
    constructor(
        public id: string,
        public dto: UpdateHomePageBlogDto,
        public image?: Multer.File | null
    ) { }
}

@CommandHandler(UpdateBlogHomePageCommand)
export class UpdateBlogHomePageUseCase
    implements ICommandHandler<UpdateBlogHomePageCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private blogsRepository: BlogsRepository
    ) { }
    async execute(command: UpdateBlogHomePageCommand): Promise<string> {
        const { id, dto, image } = command;
        
        const blog = await this.blogsRepository.findBlogOrNotFoundFailRepository(id);
        blog.updateHomePageBlogData(dto);
        console.log('BlogsService: updateBlogHomePageService - blog 😡 ', blog)
        await this.blogsRepository.save(blog);
        return blog._id.toString();
    }
}