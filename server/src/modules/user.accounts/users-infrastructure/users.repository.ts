import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../users-domain/user.entity';
import type { UserModelType } from 'src/modules/user.accounts/users-domain/user.entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

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
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
        // console.log('UsersRepository → findByLogin 👍 loginOrEmail', loginOrEmail);
        return this.UserModel.findOne(
            {
                $or: [
                    { 'accountData.userName': loginOrEmail }, // Ищем по логину
                    { 'accountData.email': loginOrEmail }    // Ищем по почте
                ]
            }
        );
    }
    async save(user: UserDocument) {
        await user.save();
    }

    async findUserByIdOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.findById(id);
        if (!user) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }

        return user;
    }
    async findUserByLoginOrEmailOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.findById(id);
        if (!user) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }

        return user;
    }

    async loginIsExist(login: string): Promise<boolean> {
        return !!(await this.UserModel.countDocuments({
            'accountData.userName': login
        }));
    }
    async findAllUsers(): Promise<UserDocument[]> {
        return this.UserModel.find();
    }
}