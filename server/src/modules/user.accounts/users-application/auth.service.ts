import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users-infrastructure/users.repository';
import { CryptoService } from './crypto.service';
import { UserContextDto } from '../users-guards/dto/user-context.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
        private cryptoService: CryptoService,
    ) { }
    async validateUser(login: string, password: string ): Promise<UserContextDto | null> {
        const user = await this.usersRepository.findByLogin(login);
        if (!user) {
            return null;
        }

        const isPasswordValid = await this.cryptoService.comparePasswords({
            password,
            hash: user.accountData.passwordHash,
        });

        if (!isPasswordValid) {
            return null;
        }

        return { id: user.id.toString() };
    }

    async login(userId: string) {
        const accessToken = this.jwtService.sign({ id: userId } as UserContextDto);

        return {
            accessToken,
        };
    }
}