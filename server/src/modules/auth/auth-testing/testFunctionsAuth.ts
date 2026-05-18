import { HTTP_STATUSES } from "src/core/utils/utils"
import { contextTests } from "../../../../test/helpers/init-settings";

export const isLoginUser = async (
    numUser: number,
    numDevice: number,
    access: string | null,
    refresh: string | null,
    email: string,
    password: string,
    userAgent: string,
    statusCode: number = HTTP_STATUSES.OK_200
) => {
    const accessTokenArray = contextTests.sessions[`accessTokenUser${numUser + 1}Devices`];
    const refreshTokenArray = contextTests.sessions[`refreshTokenUser${numUser + 1}Devices`];

    if (typeof accessTokenArray[numDevice] === 'string') {
        return {
            authData: {
                accessToken: accessTokenArray[numDevice],
                refreshToken: refreshTokenArray[numDevice]
            },
            status: statusCode
        };
    }
    const { accessToken, refreshToken, response } = await contextTests.authTestManager.login(
        access,
        refresh,
        {
            loginOrEmail: email,
            password: password
        },
        userAgent,
        statusCode
    )
    // console.log('isLoginUser: - login - accessToken, refreshToken,', accessToken, refreshToken)
    if (response.status !== statusCode) {
        return response.body;
    }
    if (response.status === statusCode) {
        const user = await contextTests.authTestManager.me(accessToken, numUser, statusCode);
        contextTests.users.addUserStateTest({ numUser, addUser: user });
        // console.log('authTestManager: me - user 👽😡👽 ', user)
        // 4. 🛑 ПЕРЕДАЧА ОТВЕТА В КОНТЕКСТ ДЛЯ СОХРАНЕНИЯ СОСТОЯНИЯ (DISPATCH)
        await contextTests.sessions.saveSessionStateTest({
            numUser,
            numDevice,
            accessToken,
            refreshToken
        });
        const accessKey = `accessTokenUser${numUser + 1}Devices`;
        const devicesAccessArray = contextTests.sessions[accessKey];
        const deviceAccessToken = devicesAccessArray[numDevice];
        const refreshKey = `refreshTokenUser${numUser + 1}Devices`;
        const devicesRefreshArray = contextTests.sessions[refreshKey];
        const deviceRefreshToken = devicesRefreshArray[numDevice];
        expect(deviceAccessToken).toBeDefined()
        expect(typeof deviceAccessToken).toBe('string')
        expect(deviceRefreshToken).toBeDefined()
        expect(typeof deviceRefreshToken).toBe('string')
    }
    return { authData: { accessToken, refreshToken }, status: statusCode };
}