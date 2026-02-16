import { UsersRepository } from '../../../user-accounts/users-infrastructure/users.repository';
import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { PostForProfile, type PostForProfileModelType } from '../../posts-domain/posts-for-profile-entity';
import { FilesService } from 'src/modules/files/files.service';
import { CreatePostForProfileDto } from '../../posts-for-profile-api/posts-for-profile-input-dto/posts.input-dto';
import { PostForProfileRepository } from '../../posts-infrastructure/posts.repository';

export class CreatePostForProfileCommand {
    constructor(
        public userId: string,
        public dto: Omit<CreatePostForProfileDto, 'userId' | 'authorPost'>,
        public image: Multer.File | null
    ) { }
}

@CommandHandler(CreatePostForProfileCommand)
export class CreatePostForProfileUseCase
    implements ICommandHandler<CreatePostForProfileCommand, string> {
    constructor(
        @InjectModel(PostForProfile.name) private PostForProfileModel: PostForProfileModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private postForProfileRepository: PostForProfileRepository,
        private usersRepository: UsersRepository,
        private filesService: FilesService,
    ) { }
    async execute(command: CreatePostForProfileCommand): Promise<string> {
        const { userId, dto, image } = command;
        // console.log('PostForProfileUseCase: - userId 😡 ', userId)
        // console.log('PostForProfileUseCase: - dto 😡 ', dto)
        // console.log('PostForProfileUseCase: - image 😡 ', image)

        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId)
        const fileName = image ? await this.filesService.createAvatarFile(image) : null;
        const post = this.PostForProfileModel.createPostForProfileInstance(
            {
                ...dto,
                image: fileName,
                userId: user.id,
                authorPost: {
                    avatar: user.profileData.avatar,
                    name: user.profileData.name ? user.profileData.name : user.accountData.login,
                    surname: user.profileData.surname ? user.profileData.surname : user.accountData.email
                }
            }
        );
        // console.log('PostForProfileService: createPostForProfileService - post 😡 ', post)
        await this.postForProfileRepository.save(post);
        // console.log('PostForProfileService: createPostForProfileService - post2 😡 ', post)
        return post._id.toString();
    }
}