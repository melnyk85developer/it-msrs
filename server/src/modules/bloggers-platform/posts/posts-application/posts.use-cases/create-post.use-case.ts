import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Post, type PostModelType } from '../../posts-domain/post.entity';
import { PostsRepository } from '../../posts-infrastructure/posts.repository';
import { BlogsRepository } from 'src/modules/bloggers-platform/blogs/blogs-infrastructure/blogs.repository';
import { CreatePostDto } from '../../posts-dto/create-post.dto';

export class CreatePostCommand {
    constructor(
        public dto: Omit<CreatePostDto, 'createdAt' | 'updatedAt' | 'deletedAt' | 'blogName'>,
        public userId?: string | undefined,
        public image?: Multer.File | null
    ) { }
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
    implements ICommandHandler<CreatePostCommand, string> {
    constructor(
        @InjectModel(Post.name) private PostModel: PostModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
    ) { }
    async execute(command: CreatePostCommand): Promise<string> {
        const { userId, dto, image } = command;
        // console.log('PostsService: createPostService: dto 😡 ', dto)
        const isBlog = await this.blogsRepository.findBlogOrNotFoundFailRepository(String(dto.blogId));
        // console.log('PostsService: createPostService: isBlog IF 😡 ', isBlog)
        const post = this.PostModel.createPostInstance({
            ...dto,
            blogId: String(isBlog._id),
            blogName: isBlog.name
        });
        // console.log('PostsService: createPostService: post PREV SAVE 😡 ', post)
        await this.postsRepository.save(post);
        // console.log('PostsService: createPostService: post RES 😡 ', post)
        return post._id.toString();
    }
}