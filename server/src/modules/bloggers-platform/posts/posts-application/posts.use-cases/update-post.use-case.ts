import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from 'src/modules/bloggers-platform/blogs/blogs-infrastructure/blogs.repository';
import { UpdatePostDto } from '../../posts-api/posts-input-dto/posts-update.input-dto';
import { PostsRepository } from '../../posts-infrastructure/posts.repository';

export class UpdatePostCommand {
    constructor(
        public id: string,
        public dto: Omit<UpdatePostDto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
        public image?: Multer.File | null
    ) { }
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase
    implements ICommandHandler<UpdatePostCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private postsRepository: PostsRepository
    ) { }
    async execute(command: UpdatePostCommand): Promise<string> {
        const { id, dto, image } = command;

        // console.log('PostsService: updatePostService: id REQ dto 😡 ', id, dto)
        const post = await this.postsRepository.findPostOrNotFoundFail(id);
        // console.log('PostsService: updatePostService: IsPost 😡 ', post)
        post.update({
            ...dto,
            id
        });
        // console.log('PostsService: updatePostService: post 😡 ', post)
        await this.postsRepository.save(post);
        return post._id.toString();
    }
}