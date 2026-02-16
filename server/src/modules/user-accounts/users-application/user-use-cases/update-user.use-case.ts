import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { UsersRepository } from "../../users-infrastructure/users.repository";
import { Multer } from 'multer';
import { UpdateUserDto } from "../../users-dto/create-user.dto";
import { FilesService } from "src/modules/files/files.service";

export class UpdateUserCommand {
    constructor(
        public id: string,
        public readonly dto: Omit<UpdateUserDto, 'deletedAt' | 'updatedAt'>,
        public avatar: Multer.File | null
    ) { }
}
@CommandHandler(UpdateUserCommand)
export class UpdateUserUseCase
    implements ICommandHandler<UpdateUserCommand, string> {
    constructor(
        private usersRepository: UsersRepository,
        private filesService: FilesService,
    ) { }

    async execute(command: UpdateUserCommand) {
        const { id} = command;
        const { avatar, dto } = command
        const fileName = avatar ? await this.filesService.createAvatarFile(avatar) : null;
        // console.log('CreateUserUseCase - email 👽 😡 👽', email)
        // console.log('UsersService: updateUserService - id, dto 😡 ', id, dto)
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(id);
        // console.log('UsersService: updateUserService - user1 😡 ', user)
        user.updateAccountData(id, {
            ...dto,
            avatar: fileName ? fileName : dto.avatar
        });
        // console.log('UsersService: updateUserService - user2 😡 ', user)
        await this.usersRepository.save(user);
        // console.log('UsersService: updateUserService - user3 😡 ', user)
        return user._id.toString();
    }
}