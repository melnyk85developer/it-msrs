import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../users-domain/user.entity';
import type { UserModelType } from 'src/modules/user-accounts/users-domain/user.entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType
    ) { }
    async save(user: UserDocument) {
        // console.log('UsersRepository: save() - user 😡 ', user)
        await user.save();
    }
    async findById(id: string): Promise<UserDocument | null> {
        return this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }
    async findByAdminRepository(params: string): Promise<UserDocument | null> {
        // console.log('UsersRepository → findByAdminRepository 👍 params', params);
        const isAdmin = await this.UserModel.findOne(
            {
                'systemUserData.adminRoles.value': params
            }
        );
        // console.log('UsersRepository → findByAdminRepository RES 👍 isAdmin', isAdmin);
        return isAdmin
    }
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
        // console.log('UsersRepository → findByLogin 👍 loginOrEmail', loginOrEmail)
        return this.UserModel.findOne(
            {
                $or: [
                    { 'accountData.login': loginOrEmail }, // Ищем по логину
                    { 'accountData.email': loginOrEmail }    // Ищем по почте
                ]
            }
        );
    }

    async findUserByIdOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.findById(id);
        if (!user) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        return user;
    }
    async findUserByLoginOrEmailOrNotFoundFail(email: string): Promise<UserDocument> {
        const user = await this.findByLoginOrEmail(email);
        if (!user) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        return user;
    }

    async loginIsExist(login: string): Promise<boolean> {
        return !!(await this.UserModel.countDocuments({
            'accountData.login': login
        }));
    }
    async findAllUsers(): Promise<UserDocument[]> {
        return this.UserModel.find();
    }
}