import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { MeViewDto } from 'src/modules/auth/auth-dto/me.view-dto';

@Injectable()
export class AuthQueryRepository {
    constructor(private usersRepository: UsersRepository) { }

    async me(userId: string): Promise<MeViewDto> {
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);

        return MeViewDto.mapToView(user);
    }
}