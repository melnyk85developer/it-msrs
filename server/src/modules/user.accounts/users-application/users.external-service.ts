import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';;
import { UsersRepository } from '../users-infrastructure/users.repository';
import * as userEntity from '../users-domain/user.entity';

@Injectable()
export class UsersExternalService {
    constructor(
        //инжектирование модели в сервис через DI
        @InjectModel(userEntity.User.name)
        private UserModel: userEntity.UserModelType,
        private usersRepository: UsersRepository,
    ) { }

    async makeUserAsSpammer(userId: string) {
        const user = await this.usersRepository.findOrNotFoundFail(userId);

        // user.makeSpammer();

        await this.usersRepository.save(user);
    }
}