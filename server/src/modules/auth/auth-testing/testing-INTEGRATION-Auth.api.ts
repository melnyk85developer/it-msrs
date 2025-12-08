import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";

export const authIntegrationTest = () => {
    describe('AUTH-INTEGRATION', () => {
        it('POST   - Ожидается успешная регистрация пользователя и отправка письма с активацией', async () => {
            contextTests.mailService.sendConfirmationEmail = jest.fn((from, to, subject, text, html) => {
                return Promise.resolve(true)
            })
            const response = await contextTests.userService.registrationService(
                {
                    login: contextTests.users.correctUserNames[1],
                    email: contextTests.users.correctUserEmails[1],
                    password: contextTests.users.correctUserPasswords[1],
                }
            );
            expect(response).toHaveProperty('_id')
            expect(contextTests.mailService.sendMail).toHaveBeenCalledWith(
                expect.any(String),
                contextTests.users.correctUserEmails[1],
                expect.stringContaining('Активация аккаунта'),
                expect.any(String),
                expect.stringContaining('href="http://localhost:5006/auth/confirm-email'),
            );
            expect(response).not.toBeNull();
            // if (response && typeof response !== 'number' && response._id) {
            //     contextTests.createdUser2 = true
            // }
        });
        it('POST   - Ожидается успешное создание access-token', async () => {
            const tokens = await contextTests.tokenService.generateTokens(contextTests.constants.accessPayload);
            contextTests.sessions.accessTokenUser2Devices.push(tokens.accessToken);
            expect(contextTests.sessions.accessTokenUser2Devices[0]).toBeDefined();
            expect(typeof contextTests.sessions.accessTokenUser2Devices[0]).toBe('string');
        });
        it('POST   - Ожидается успешное создание refresh-token', async () => {
            const tokens = await contextTests.tokenService.generateTokens(contextTests.constants.refreshPayload);
            contextTests.sessions.refreshTokenUser1Devices.push(tokens.refreshToken)
            expect(contextTests.sessions.refreshTokenUser1Devices[0]).toBeDefined();
            expect(typeof contextTests.sessions.refreshTokenUser1Devices[0]).toBe('string');
        });
        it('POST   - Ожидается успешная валидация access-token', async () => {
            const decoded = await contextTests.tokenService.validateRefreshToken(
                `Bearer ${contextTests.sessions.accessTokenUser1Devices[0]}`
            );
            expect(decoded).toBeDefined();
        });
        it('POST   - Ожидается успешная валидация refresh-token', async () => {
            const decoded = await contextTests.tokenService.validateRefreshToken(
                contextTests.sessions.refreshTokenUser1Devices[0]
            );
            expect(decoded).toBeDefined();
        });
        it('POST   - Ожидается ошибка при неверном refresh-token', async () => {
            const decoded = await contextTests.tokenService.validateRefreshToken(contextTests.constants.invalidToken);
            expect(decoded).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT);
        });
        it('POST   - Ожидается ошибка при неверном access-token', async () => {
            const decoded = await contextTests.tokenService.validateAccessToken(contextTests.constants.invalidToken!);
            expect(decoded).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
        });
    });
}
