import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, type BlogModelType } from '../../blogs-domain/blog.entity';
import { BlogsRepository } from '../../blogs-infrastructure/blogs.repository';
import { CreateBlogDto } from '../../blogs-dto/create-blog.dto';
import { ObjectId } from "mongodb";

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
        // console.log('BlogsEntity: createInstance - userId, dto, image 😡 ', userId, dto, image)
        const blog = this.BlogModel.createBlogInstance({
            ...dto,
            userId: String(new ObjectId()) // TODO - Сука заменить на req userId
        });
        // console.log('BlogsEntity: createInstance - blog 😡 1', blog)
        await this.blogsRepository.save(blog);
        // console.log('BlogsEntity: createInstance - blog 😡 2', blog)
        return blog._id.toString();
    }
}