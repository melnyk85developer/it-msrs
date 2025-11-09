import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../users-domain/user.entity';
import type { UserModelType } from 'src/modules/user.accounts/users-domain/user.entity';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType
    ) { }

    async findById(id: string): Promise<UserDocument | null> {
        return this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async save(user: UserDocument) {
        await user.save();
    }

    async findOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        return user;
    }

    async findByLogin(login: string): Promise<UserDocument | null> {
        return this.UserModel.findOne({ login });
    }
    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.UserModel.findOne({ email });
    }
    async loginIsExist(login: string): Promise<boolean> {
        return !!(await this.UserModel.countDocuments({ login: login }));
    }
}