import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserExternalDto } from './users-external-dto/users.external-dto';
import { User } from '../../users-domain/user.entity';
import type { UserModelType } from 'src/modules/user.accounts/users-domain/user.entity';

@Injectable()
export class UsersExternalQueryRepository {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
    ) { }

    async getUserByIdOrNotFoundFail(id: string): Promise<UserExternalDto> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return UserExternalDto.mapToView(user);
    }
}