import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../users-domian/user.entity';
import type { UserModelType } from 'src/modules/user.accounts/users-domian/user.entity';

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
}