import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from '../users-dto/create-user.dto';
import { UsersRepository } from '../users-infrastructure/users.repository';
import { User } from '../users-domain/user.entity';
import { INTERNAL_STATUS_CODE } from 'src/shared/utils/utils';
import { ErRes } from 'src/shared/utils/ErRes';
import { EmailService } from 'src/modules/notifications/email.service';
import { CryptoService } from './crypto.service';
import type { UserModelType } from '../users-domain/user.entity';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private emailService: EmailService,
        private cryptoService: CryptoService,
    ) { }

    async registrationUserService(dto: Omit<CreateUserDto, 'createdAt' | 'updatedAt' | 'deletedAt'>) {
        // console.log('registrationServices - login, password, email 😡😡', login, password, email)
        const { email, login } = dto
        const isLogin = await this.usersRepository.findByLogin(login)

        if (isLogin) {
            console.log('registrationServices - isLogin: ', isLogin)
            throw new ErRes(INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS)
        }
        const isEmail = await this.usersRepository.findByEmail(email)
        if (isEmail) {
            console.log('registrationServices - isEmail: ', isEmail)
            throw new ErRes(INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS)
        }

        const createdUserId = await this.createUserService(dto);

        const user = await this.usersRepository.findOrNotFoundFail(
            createdUserId,
        );
        console.log('registrationUserService: - user 😡 ', user)
        
        const confirmationCode = uuid.v4()
        user.setConfirmationCode(confirmationCode);
        await this.usersRepository.save(user);

        console.log('registrationUserService: confirmationCode - user 😡 ', user)

        this.emailService.sendConfirmationEmail(
            user.accountData.email,
            confirmationCode
        ).catch(console.error);
    }

    async createUserService(dto: Omit<CreateUserDto, 'createdAt' | 'updatedAt' | 'deletedAt'>, confirmationCode?: string): Promise<string> {
        const user = await this.UserModel.createUserInstance(dto);
        console.log('UsersService: createUserService - user 😡 ', user)
        await this.usersRepository.save(user);
        return user._id.toString();
    }
    async updateUserService(id: string, dto: Omit<UpdateUserDto, 'deletedAt' | 'updatedAt'>): Promise<string> {
        const user = await this.usersRepository.findOrNotFoundFail(id);
        user.update(dto);
        await this.usersRepository.save(user);
        return user._id.toString();
    }
    async deleteUserService(id: string) {
        const user = await this.usersRepository.findOrNotFoundFail(id);
        // console.log('UsersService: deleteUserService - user 😡 ', user)
        user.makeDeleted();
        await this.usersRepository.save(user);
    }
}