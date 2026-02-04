import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";
import { CreateUserInputDto } from "../users-dto/users.input-dto";
import { deleteAllData } from "test/helpers/delete-all-data";

export const resetPasswordInegrationTest = () => {
    describe('RESET-PASSWORD-INTEGRATION', () => {
        const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/i;
        beforeEach(async () => {
            await deleteAllData(contextTests.app);
            // Добавить отчистку контекста!
            const data: CreateUserInputDto = {
                login: contextTests.users.correctUserNames[0],
                password: contextTests.users.correctUserPasswords[0],
                email: contextTests.users.correctUserEmails[0]
            }
            const { createdEntity, response } = await contextTests.usersTestManager.createUser(
                data,
                contextTests.constants.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            if (response.status === HTTP_STATUSES.CREATED_201) {
                contextTests.users.addUserStateTest({ numUser: 0, addUser: createdEntity });
                // console.log('TEST: contextTests.createdUser1 😡 ', contextTests.users.createdUsers[0])
            }
            jest.useRealTimers();
        });
        afterEach(() => {
            jest.useRealTimers();
        });
        it('RECEIVE - Ожидается внутренний статус код 953, - Если пользователь не найден и сообщение ошибки: Такого пользователя не найденно!', async () => {
            await expect(contextTests.userService.ressetPasswordService('nonexistent@example.com'))
                .rejects
                .toMatchObject({
                    message: 'Такого пользователя не найденно!',
                    code: INTERNAL_STATUS_CODE.NOT_FOUND_USER
                });
        });
        it('SUCCESS - Ожидается внутренний статус код 900, - Успешное отправление на email сообщение о попытке сбросить пароль!', async () => {
            const result = await contextTests.userService.ressetPasswordService(contextTests.users.correctUserEmails[0]);
            expect(result.code).toBe(INTERNAL_STATUS_CODE.SUCCESS);
            expect(result.serviceMessage).toBe(`Сообщение успешно отправлено на E-Mail: ${contextTests.users.correctUserEmails[0]}. Проверьте почту и следуйте дальнейшим инструкциям в письме. ${result.data.expirationISO}`);
            expect(result.data.expirationISO).toMatch(isoDateRegex); // Проверяет формат строки
            expect(result.done).toEqual(expect.any(Boolean));
        });
        it('ERROR   - Ожидается внутренний статус код 680, - Ошибка если 3 минуты не прошло с момента отправки сообщения!', async () => {
            // 1. Первая отправка (запускает таймер)
            await contextTests.userService.ressetPasswordService(contextTests.users.correctUserEmails[0]);
            // 2. Вторая отправка (ожидаем ошибку)
            await expect(contextTests.userService.ressetPasswordService(contextTests.users.correctUserEmails[0]))
                .rejects
                .toMatchObject({
                    code: INTERNAL_STATUS_CODE.BAD_REQUEST_TIME_HASNT_PASSED_YET,
                    // Вставляем регулярку прямо сюда через expect.stringMatching
                    message: expect.stringMatching(/⛔️ Время еще не истекло до следующего запроса! \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/)
                });
        });
        it('BLOCKED - Ожидается внутренний статус код 678, - Блокировка пользователя, если за последние 18 минут было больше 5 запросов', async () => {
            for (let i = 0; i < 5; i++) { // первые 5 итераций
                const dataCode = {
                    confirmationCode: '245678901245678901123456',
                    isBlocked: false,
                    isCooldown: true,
                    add: new Date().toISOString(),
                    minutes: 3,
                    field: 'password',
                    userId: contextTests.users.createdUsers[0]!.id,
                };
                // Вычисляем время для каждого запроса, отнимая 18 - i*3 минуты
                dataCode.add = new Date(Date.now() - (18 * 60 * 1000) + i * (3 * 60 * 1000)).toISOString();
                // dataCode.minutes = i < 5 ? 3 : 40
                await contextTests.confirmationService.createConfirmationsCodesService(dataCode);
            }
            await expect(contextTests.userService.ressetPasswordService(contextTests.users.createdUsers[0]!.email)) // Шестая попытка
                .rejects
                .toMatchObject({
                    code: INTERNAL_STATUS_CODE.BAD_REQUEST_A_LOT_OF_REQUESTS_TRY_AGAIN_LATER,
                    // Вставляем регулярку прямо сюда через expect.stringMatching
                    message: expect.stringMatching(/⛔️ Слишком много запросов за последнее время, Вам последнее предупреждение! \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/)
                });
            // Включаем фейковые таймеры, но ИСКЛЮЧАЕМ системные функции, нужные Mongoose
            jest.useFakeTimers({
                doNotFake: [
                    'nextTick',
                    'setImmediate',
                    'clearImmediate',
                    'setInterval',
                    'clearInterval',
                    'setTimeout',
                    'clearTimeout',
                ],
            });
            // 2. Прыжок в будущее: +38 минут от текущего реального времени
            // Т.к. мы в тесте использовали new Date() ранее, нам нужно отталкиваться от него
            const now = Date.now();
            jest.setSystemTime(now + 38 * 60 * 1000);
            // 3. Проверяем блокировку на 38-й минуте
            await expect(contextTests.userService.ressetPasswordService(contextTests.users.createdUsers[0]!.email))
                .rejects
                .toMatchObject({
                    code: INTERNAL_STATUS_CODE.BAD_REQUEST_FUNCTION_BLOCKED,
                    message: expect.stringMatching(/⛔️ Функция отпрвки сообщения на E-Mail временно заблокирована/) // Твоя регулярка
                });

            // 4. Прыжок еще на 3 минуты (итого 41 минута, блокировка (40 мин) должна спасть)
            jest.setSystemTime(now + 41 * 60 * 1000);
            // 5. Проверяем успех
            const success = await contextTests.userService.ressetPasswordService(contextTests.users.createdUsers[0]!.email);
            expect(success.code).toBe(INTERNAL_STATUS_CODE.SUCCESS);
            expect(success.code).toBe(INTERNAL_STATUS_CODE.SUCCESS);
            expect(success.serviceMessage).toBe(`Сообщение успешно отправлено на E-Mail: ${contextTests.users.correctUserEmails[0]}. Проверьте почту и следуйте дальнейшим инструкциям в письме. ${success.data.expirationISO}`);
            expect(success.data.expirationISO).toMatch(isoDateRegex); // Проверяет формат строки
            expect(success.done).toEqual(expect.any(Boolean));
        });
        it('SUCCESS - Ожидается внутренний статус код 900, - Успешное обновление пароля в профиле пользователя!', async () => {

            const isSendEmail = await contextTests.authServices.passwordRecoverySendEmailService(
                contextTests.users.correctUserEmails[0]
            )
            if (isSendEmail) {
                contextTests.codeConfirmation.addCodeConfirmationStateTest({
                    numConfirmation: 2,
                    nameConfirmation: 'Password',
                    newCode: isSendEmail.data!.code
                })
                // console.log('TEST: contextTests.createdUser1 😡 ', contextTests.users.createdUsers[1])
            }
            // console.log('TEST: isSendEmail 😡 ', isSendEmail)
            const success = await contextTests.authServices.ressetPasswordService(
                'new-password',
                isSendEmail.data!.code
            );
            // console.log('TEST: success 😡 ', success)
            expect(success.code).toBe(INTERNAL_STATUS_CODE.SUCCESS);
            expect(success.data).toBe(contextTests.users.createdUsers[0]!.id);
            expect(success.serviceMessage).toBe(`Пароль успешно обновлен!`);
            expect(success.done).toEqual(expect.any(Boolean));
        });
    });
}
