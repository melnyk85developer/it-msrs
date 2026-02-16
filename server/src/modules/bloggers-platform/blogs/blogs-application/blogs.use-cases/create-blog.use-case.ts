import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, type BlogModelType } from '../../blogs-domain/blog.entity';
import { BlogsRepository } from '../../blogs-infrastructure/blogs.repository';
import { CreateBlogDto } from '../../blogs-dto/create-blog.dto';

export class CreateBlogCommand {
    constructor(
        public userId: string,
        public dto: Omit<CreateBlogDto, 'userId'>,
        public image?: Multer.File | null
    ) { }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
    implements ICommandHandler<CreateBlogCommand, string> {
    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private blogsRepository: BlogsRepository,
    ) { }
    async execute(command: CreateBlogCommand): Promise<string> {
        const { userId, dto, image } = command;
        const blog = this.BlogModel.createBlogInstance({
            ...dto,
            userId: userId
        });
        await this.blogsRepository.save(blog);
        return blog._id.toString();
    }
}