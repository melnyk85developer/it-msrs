import { INTERNAL_STATUS_CODE } from "src/shared/utils/utils";
import { contextTests } from "test/contextTests";


export const authIntegrationTest = () => {
    describe('AUTH-INTEGRATION', () => {
        it('POST   - Ожидается успешная регистрация пользователя и отправка письма с активацией', async () => {
            contextTests.mailService.sendMail = jest.fn((from, to, subject, text, html) => {
                return Promise.resolve(true)
            })
            const response = await contextTests.authServices.registrationServices(
                contextTests.correctUserName2,
                contextTests.correctUserPassword2,
                contextTests.correctUserEmail2
            );
            expect(response).toHaveProperty('_id')
            expect(contextTests.mailService.sendMail).toHaveBeenCalledWith(
                expect.any(String),
                contextTests.correctUserEmail2,
                expect.stringContaining('Активация аккаунта'),
                expect.any(String),
                expect.stringContaining('href="http://localhost:5006/auth/confirm-email'),
            );
            expect(response).not.toBeNull();
            if (response && typeof response !== 'number' && response._id) {
                contextTests.createdUser2 = true
            }
        });
        it('POST   - Ожидается успешное создание access-token', async () => {
            const tokens = await contextTests.tokenService.generateTokens(
                contextTests.payload,
                contextTests.randomId as string
            );
            contextTests.accessTokenUser2Device1 = tokens.accessToken;
            expect(contextTests.accessTokenUser2Device1).toBeDefined();
            expect(typeof contextTests.accessTokenUser2Device1).toBe('string');
        });
        it('POST   - Ожидается успешное создание refresh-token', async () => {
            const tokens = await contextTests.tokenService.generateTokens(
                contextTests.payload,
                contextTests.randomId as string
            );
            contextTests.refreshTokenUser1Device1 = tokens.refreshToken;
            expect(contextTests.refreshTokenUser1Device1).toBeDefined();
            expect(typeof contextTests.refreshTokenUser1Device1).toBe('string');
        });
        it('POST   - Ожидается успешная валидация access-token', async () => {
            const decoded = await contextTests.tokenService.validateRefreshToken(
                `Bearer ${contextTests.accessTokenUser1Device1}`
            );
            expect(decoded).toBeDefined();
        });
        it('POST   - Ожидается успешная валидация refresh-token', async () => {
            const decoded = await contextTests.tokenService.validateRefreshToken(
                contextTests.refreshTokenUser1Device1
            );
            expect(decoded).toBeDefined();
        });
        it('POST   - Ожидается ошибка при неверном refresh-token', async () => {
            const decoded = await contextTests.tokenService.validateRefreshToken(contextTests.invalidToken);
            expect(decoded).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT);
        });
        it('POST   - Ожидается ошибка при неверном access-token', async () => {
            const decoded = await contextTests.tokenService.validateAccessToken(contextTests.invalidToken!);
            expect(decoded).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
        });
    });
}
