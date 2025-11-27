import { Injectable } from '@nestjs/common';
import { MeViewDto } from 'src/modules/user.accounts/users-dto/users.view-dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthQueryRepository {
    constructor(private usersRepository: UsersRepository) { }

    async me(userId: string): Promise<MeViewDto> {
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);

        return MeViewDto.mapToView(user);
    }
}