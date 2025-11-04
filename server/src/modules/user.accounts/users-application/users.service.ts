import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from '../users-dto/create-user.dto';
import { UsersRepository } from '../users-infrastructure/users.repository';
import { User } from '../users-domian/user.entity';
import type { UserModelType } from '../users-domian/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private UserModel: UserModelType,
        private usersRepository: UsersRepository,
    ) { }

    async createUserService(dto: Omit<CreateUserDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<string> {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const date = new Date();
        const createdAt = date.toISOString();
        const user = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordHash: passwordHash,
            createdAt: createdAt,
            updatedAt: createdAt,
            deletedAt: null
        });
        // console.log('UsersService: createUserService - user 😡 ', user)

        await this.usersRepository.save(user);
        return user._id.toString();
    }
    async updateUserService(id: string, dto: Omit<UpdateUserDto, 'deletedAt' | 'updatedAt'>): Promise<string> {
        const date = new Date();
        const updatedAt = date.toISOString();
        const user = await this.usersRepository.findOrNotFoundFail(id);
        // не присваиваем св-ва сущностям напрямую в сервисах! даже для изменения одного св-ва
        // создаём метод
        user.update({
            ...dto,
            updatedAt: updatedAt,
            deletedAt: null
        }); // change detection
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