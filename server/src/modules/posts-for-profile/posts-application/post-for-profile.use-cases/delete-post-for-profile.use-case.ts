import { UsersRepository } from '../../../user-accounts/users-infrastructure/users.repository';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PostForProfileRepository } from '../../posts-infrastructure/posts.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

export class DeletePostForProfileCommand {
    constructor(
        public postId: string,
        public userId: string
    ) { }
}

@CommandHandler(DeletePostForProfileCommand)
export class DeletePostForProfileUseCase
    implements ICommandHandler<DeletePostForProfileCommand, void> {
    constructor(
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private postForProfileRepository: PostForProfileRepository,
        private usersRepository: UsersRepository,
    ) { }
    async execute(command: DeletePostForProfileCommand): Promise<void> {
        const { postId, userId } = command;
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        const post = await this.postForProfileRepository.findPostForProfileByIdOrNotFoundFailRepository(postId)
        // console.log('UsersService: deleteUserService - user 😡 ', user)
        // console.log('UsersService: deleteUserService - post 😡 ', post)
        if(post.userId !== userId){
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_POST);
        }
        post.makeDeletedPostForProfile();
        // console.log('UsersService: deleteUserService - post 😡 ', post)
        await this.postForProfileRepository.save(post);
    }
}