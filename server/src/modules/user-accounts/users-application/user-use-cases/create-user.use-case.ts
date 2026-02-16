import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { UsersRepository } from "../../users-infrastructure/users.repository";
import { CryptoService } from "../crypto.service";
import { InjectModel } from "@nestjs/mongoose";
import { Multer } from 'multer';
import { User, type UserModelType } from "../../users-domain/user.entity";
import { CreateUserDto } from "../../users-dto/create-user.dto";
import { FilesService } from "src/modules/files/files.service";

export class CreateUserCommand {
    constructor(
        public readonly dto: Omit<CreateUserDto, 'createdAt' | 'updatedAt' | 'deletedAt'>,
        public avatar: Multer.File | null
    ) { }
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
    implements ICommandHandler<CreateUserCommand, string> {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
        private filesService: FilesService,
    ) { }

    async execute(command: CreateUserCommand) {
        const { email, login, password } = command.dto;
        const { avatar, dto } = command
        const fileName = avatar ? await this.filesService.createAvatarFile(avatar) : null;
        // console.log('CreateUserUseCase - email 👽 😡 👽', email)
        let role: any
        let isBot: boolean
        // console.log('CreateUserUseCase - email, login, password 😡 avatar', email, login, password, avatar)
        const isLogin = await this.usersRepository.findByLoginOrEmail(login)
        if (isLogin) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS);
        }
        const isEmail = await this.usersRepository.findByLoginOrEmail(email)
        if (isEmail) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS)
        }
        const passwordHash = await this.cryptoService.createPasswordHash(password);
        const isUsers = await this.usersRepository.findAllUsers()
        if (!isUsers.length) {
            role = { value: "ADMIN", description: "Администратор" }
        } else {
            role = { value: "USER", description: "Пользователь" }
        }
        if (dto.isBot) {
            isBot = dto.isBot
        } else {
            isBot = false
        }
        const user = await this.UserModel.createUserInstance({
            ...dto,
            avatar: fileName ? fileName : null,
            passwordHash,
            role,
            isBot: isBot
        });
        // console.log('CreateUserUseCase - user 😡 ', user)
        await this.usersRepository.save(user);
        // console.log('CreateUserUseCase - user._id.toString() 😡 ', user._id.toString())
        return user._id.toString();
    }
}