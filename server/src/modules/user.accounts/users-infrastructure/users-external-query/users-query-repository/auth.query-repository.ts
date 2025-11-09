import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersRepository } from '../../users.repository';
import { MeViewDto } from 'src/modules/user.accounts/users-api/view-dto-users/users.view-dto';

@Injectable()
export class AuthQueryRepository {
    constructor(private usersRepository: UsersRepository) { }

    async me(userId: string): Promise<MeViewDto> {
        const user = await this.usersRepository.findOrNotFoundFail(userId);

        return MeViewDto.mapToView(user);
    }
}