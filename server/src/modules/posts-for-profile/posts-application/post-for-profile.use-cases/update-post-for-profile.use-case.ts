import { UsersRepository } from '../../../user-accounts/users-infrastructure/users.repository';
import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { PostForProfile, type PostForProfileModelType } from '../../posts-domain/posts-for-profile-entity';
import { FilesService } from 'src/modules/files/files.service';
import { CreatePostForProfileDto } from '../../posts-for-profile-api/posts-for-profile-input-dto/posts.input-dto';
import { PostForProfileRepository } from '../../posts-infrastructure/posts.repository';
import { UpdatePostForProfileDto } from '../../posts-for-profile-api/posts-for-profile-input-dto/posts-update.input-dto';

export class UpdatePostForProfileCommand {
    constructor(
        public postId: string,
        public userId: string,
        public image: Multer.File | null,
        public dto: Omit<UpdatePostForProfileDto, 'postId' | 'image' | 'userId'>,
    ) { }
}

@CommandHandler(UpdatePostForProfileCommand)
export class UpdatePostForProfileUseCase
    implements ICommandHandler<UpdatePostForProfileCommand, string> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private postForProfileRepository: PostForProfileRepository,
        private filesService: FilesService,
    ) { }
    async execute(command: UpdatePostForProfileCommand): Promise<string> {
        const { postId, userId, dto, image } = command;
        // console.log('PostForProfileUseCase: - userId 😡 ', userId)
        // console.log('PostForProfileUseCase: - dto 😡 ', dto)
        // console.log('PostForProfileUseCase: - image 😡 ', image)

        const post = await this.postForProfileRepository.findPostForProfileByIdOrNotFoundFailRepository(postId)
        // console.log('PostForProfileService: updatePostForProfileService - post1 😡 ', post)
        const fileName = image ? await this.filesService.createAvatarFile(image) : null;
        post.updatePostForProfile({
            ...dto,
            postId,
            userId,
            image: fileName
        })
        // console.log('PostForProfileService: updatePostForProfileService - post2 😡 ', post)
        await this.postForProfileRepository.save(post);
        // console.log('PostForProfileService: updatePostForProfileService - post3 😡 ', post)
        return post._id.toString();
    }
}