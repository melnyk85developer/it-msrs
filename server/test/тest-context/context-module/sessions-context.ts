import { Session } from "src/modules/usersSessions/sessions-domain/sessions.entity";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { DomainExceptionCode } from "src/core/exceptions/domain-exception-codes";
import { contextTests } from "test/helpers/init-settings";

export class SessionContextClass {
    public readonly userAgent: string[];
    public total_count_sessions_user1: number = 0;
    public total_count_sessions_user2: number = 0;
    public total_count_sessions_user3: number = 0;
    public total_count_sessions_user4: number = 0;

    public sessionsUser1: Session[];
    public accessTokenUser1Devices: string[];
    public refreshTokenUser1Devices: string[];
    public sessionsUser2: Session[];
    public accessTokenUser2Devices: string[];
    public refreshTokenUser2Devices: string[];
    public sessionsUser3: Session[];
    public accessTokenUser3Devices: string[];
    public refreshTokenUser3Devices: string[];
    public sessionsUser4: Session[];
    public accessTokenUser4Devices: string[];
    public refreshTokenUser4Devices: string[];

    constructor() {
        this.accessTokenUser1Devices = [];
        this.refreshTokenUser1Devices = [];
        this.sessionsUser1 = [];
        this.accessTokenUser2Devices = [];
        this.refreshTokenUser2Devices = [];
        this.sessionsUser2 = [];
        this.accessTokenUser3Devices = [];
        this.refreshTokenUser3Devices = [];
        this.sessionsUser3 = [];
        this.accessTokenUser4Devices = [];
        this.refreshTokenUser4Devices = [];
        this.sessionsUser4 = [];
        this.userAgent = [
            // 📱 iPhone 15 Pro (iOS 17, Safari)
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            // 📱 Samsung Galaxy S24 (Android 14, Chrome)
            'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.0 Mobile Safari/537.36',
            // 📱 Google Pixel 8 Pro (Android 14, Chrome)
            'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.0 Mobile Safari/537.36',
            // 💻 Windows 11 (Chrome)
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
            // 💻 macOS Sonoma (Safari)
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
            // 💻 Ubuntu 24.04 LTS (Firefox)
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
            // 💻 Macbook M3 Pro (Edge)
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36 Edg/125.0.2535.67',
            // 📱 iPad Pro M2 (iPadOS 17, Safari)
            'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            // 📺 Smart TV Samsung Tizen OS
            'Mozilla/5.0 (SMART-TV; Linux; Tizen 7.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/5.1 TV Safari/537.36',
            // 📺 Android TV (Sony Bravia, Android 12)
            'Mozilla/5.0 (Linux; Android 12; BRAVIA 4K UR3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.0 Safari/537.36',
            // 🕹️ Steam Deck (SteamOS 3, Chrome)
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36 SteamOS/3.0 SteamDeck/1.0',
            // 📱 Xiaomi 14 Ultra (HyperOS, Android 14)
            'Mozilla/5.0 (Linux; Android 14; Xiaomi 23127PN0CC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Mobile Safari/537.36'
        ];
    }
    public async saveSessionStateTest({
        numUser,
        numDevice,
        accessToken,
        refreshToken
    }: {
        numUser: number;
        numDevice: number;
        accessToken: string;
        refreshToken: string;
    }) {
        // console.log('SessionContextClass: saveSessionStateTest - 👽😡👽 numUser, numDevice, accessToken, refreshToken', numUser, numDevice, accessToken, refreshToken)
        
        const accessTokenKey = `accessTokenUser${numUser + 1}Devices`;
        const refreshTokenKey = `refreshTokenUser${numUser + 1}Devices`;
        const sessionsKey = `sessionsUser${numUser + 1}`;
        const totalCountKey = `total_count_sessions_user${numUser + 1}`;

        // console.log('SessionContextClass: accessTokenKey 👽😡👽 ', accessTokenKey)
        // console.log('SessionContextClass: refreshTokenKey 👽😡👽 ', refreshTokenKey)

        // 1. Берём старые массивы
        const oldAccess = this[accessTokenKey] ?? [];
        const oldRefresh = this[refreshTokenKey] ?? [];
        const oldSessions = this[sessionsKey] ?? [];

        // 2. Создаём новые, заменяя элемент по индексу
        const newAccess = [...oldAccess];
        newAccess[numDevice] = accessToken;

        const newRefresh = [...oldRefresh];
        newRefresh[numDevice] = refreshToken;

        // 3. Достаём сессию из БД
        const userDbId = contextTests.users.createdUsers[numUser]!.id;
        // console.log('SessionContextClass: userDbId 👽😡👽 ', userDbId)
        const user = await contextTests.usersRepository.findById(userDbId);
        // console.log('SessionContextClass: user 👽😡👽 ', user)
        const devices = await contextTests.sessiosRepository.findAllSessionsByUserIdOrNotFoundFail(userDbId);
        // console.log('SessionContextClass: devices 👽😡👽 ', devices)

        if (!user) throw new DomainException(DomainExceptionCode.NotFound, `User ${userDbId} not found`);

        const payload = await contextTests.tokenService.decodeRefreshToken(refreshToken);

        if (!payload || !payload.deviceId)
            throw new DomainException(DomainExceptionCode.BadRequest, "Refresh token invalid");

        const newSession = devices.find(d => d.deviceId === payload.deviceId);

        if (!newSession)
            throw new DomainException(DomainExceptionCode.BadRequest, `Session not found for deviceId ${payload.deviceId}`);

        // 4. Иммутабельное обновление sessions — строго по индексу
        const newSessions = [...oldSessions];
        newSessions[numDevice] = newSession;

        // 5. Сохраняем новые массивы в контекст
        this[accessTokenKey] = newAccess;
        this[refreshTokenKey] = newRefresh;
        this[sessionsKey] = newSessions;

        // 6. Пересчитываем total_count
        this[totalCountKey] = newSessions.filter(x => x != null).length;
    }
    public async updateAccessRefreshTokenUsersStateTest({ numUser, numDevice, accessToken, refreshToken }: {
        numUser: number;
        numDevice: number;
        accessToken: string;
        refreshToken: string;
    }) {
        const accessKey = `accessTokenUser${numUser + 1}Devices`;
        const refreshKey = `refreshTokenUser${numUser + 1}Devices`;
        // создаём новые массивы вместо прямого изменения
        const updatedAccessTokens = this[accessKey].map((t: string, index: number) =>
            index === numDevice ? accessToken : t
        );
        const updatedRefreshTokens = this[refreshKey].map((t: string, index: number) =>
            index === numDevice ? refreshToken : t
        );
        // пересохраняем новые массивы
        this[accessKey] = updatedAccessTokens;
        this[refreshKey] = updatedRefreshTokens;
    }
    public async deleteSessionStateTest({ numUser, numDevice, accessToken, refreshToken, userId }: {
        numUser: number;
        numDevice: number;
        accessToken: string;
        refreshToken: string;
        userId?: string;
    }) {
        const accessKey = `accessTokenUser${numUser + 1}Devices`;
        const refreshKey = `refreshTokenUser${numUser + 1}Devices`;
        const sessionKey = `sessionsUser${numUser + 1}`;
        const updatedAccessTokens = this[accessKey].map((t: string, index: number) =>
            index === numDevice ? null : t
        );
        console.log('SessionContextClass: updatedAccessTokens 👽😡👽 ', updatedAccessTokens)
        const updatedRefreshTokens = this[refreshKey].map((t: string, index: number) =>
            index === numDevice ? null : t
        );
        console.log('SessionContextClass: updatedRefreshTokens 👽😡👽 ', updatedRefreshTokens)
        const updatedSessions = this[sessionKey].map((s: any, index: number) =>
            index === numDevice ? null : s
        );
        this[accessKey] = updatedAccessTokens
        this[refreshKey] = updatedRefreshTokens
        this[sessionKey] = updatedSessions
        this.total_count_sessions_user1--
    }
    public async deleteAllSessionStateTest({ numUser, numDevice, accessToken, refreshToken, userId }: {
        numUser: number;
        numDevice: number;
        accessToken: string;
        refreshToken: string;
        userId?: string;
    }) {

        this[`accessTokenUser${numUser + 1}Devices`] = [this[`accessTokenUser${numUser + 1}Devices`][numDevice]]
        this[`refreshTokenUser${numUser + 1}Devices`] = [this[`refreshTokenUser${numUser + 1}Devices`][numDevice]]
        this[`sessionsUser${numUser + 1}`] = [this[`sessionsUser${numUser + 1}`][numDevice]]

        this.total_count_sessions_user1 = this[`sessionsUser${numUser + 1}`].length
    }
}