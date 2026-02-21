import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { UsersRepository } from '../../user-accounts/users-infrastructure/users.repository';
import { CryptoService } from '../../user-accounts/users-application/crypto.service';
import { UserContextDto } from '../../user-accounts/users-guards/dto/user-context.dto';
import { UAParser } from 'ua-parser-js';
import geoip, { Lookup } from 'geoip-lite';

export type ParseDeviceNameType = {
    osName: string | null;
    osVersion: string | null;
    browserName: string | null;
    browserVersion: string | null;
    device: string | null;
    country: string | null;
    city: string | null;
}

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) { }
    async validateUserService(login: string, password: string): Promise<UserContextDto | null> {
        // console.log('AuthService → validateUser: login, password 👍', login, password);
        const user = await this.usersRepository.findByLoginOrEmail(login);
        if (!user) {
            return null;
        }
        const isPasswordValid = await this.cryptoService.comparePasswords({
            password,
            hash: user.passwordHash,
        });
        if (!isPasswordValid) {
            return null;
        }
        return { id: user.id.toString() };
    }
    private async _myParserService(ip: string, userAgent: string): Promise<ParseDeviceNameType> {
        const parser = new UAParser(userAgent);
        const uaResult = parser.getResult();
        const osName = uaResult.os.name || null;
        const osVersion = uaResult.os.version || null;
        const browserName = uaResult.browser.name || null;
        const browserVersion = uaResult.browser.version || null;
        const device = uaResult.device.type || null;
        const geo: Lookup | null = geoip.lookup(ip);
        const country = geo ? geo.country : null;
        const city = geo ? geo.city : null;

        return { osName, osVersion, browserName, browserVersion, device, country, city }
    }
}