import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Post, type PostModelType } from '../../posts-domain/post.entity';
import { PostsRepository } from '../../posts-infrastructure/posts.repository';
import { BlogsRepository } from 'src/modules/bloggers-platform/blogs/blogs-infrastructure/blogs.repository';
import { CreatePostDto } from '../../posts-dto/create-post.dto';

export class CreatePostOneBlogCommand {
    constructor(
        public userId: string,
        public dto: Omit<CreatePostDto, 'blogId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'blogName'>, 
        public blogId: string,
        public image?: Multer.File | null
    ) { }
}

@CommandHandler(CreatePostOneBlogCommand)
export class CreatePostOneBlogUseCase
    implements ICommandHandler<CreatePostOneBlogCommand, string> {
    constructor(
        @InjectModel(Post.name) private PostModel: PostModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
    ) { }
    async execute(command: CreatePostOneBlogCommand): Promise<string> {
        const { userId, dto, blogId, image } = command;
        // console.log('CreatePostOneBlogUseCase: command.blogId 😡 ', blogId)
        const isBlog = await this.blogsRepository.findBlogOrNotFoundFailRepository(blogId);
        // console.log('PostsService: createPostOneBlogService: isBlog 😡 ELSE', isBlog)
        const post = this.PostModel.createPostInstance({
            ...dto,
            blogId: blogId,
            blogName: isBlog.name
        });
        await this.postsRepository.save(post);
        return post._id.toString();
    }
}