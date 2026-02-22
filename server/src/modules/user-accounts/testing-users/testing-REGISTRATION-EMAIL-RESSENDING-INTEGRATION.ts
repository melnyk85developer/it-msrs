import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";
import { CreateUserInputDto } from "../users-dto/users.input-dto";
import { deleteAllData } from "test/helpers/delete-all-data";
import { ConfirmationCodeRegistrationCommand } from "src/modules/confirmationsCodes/confirmations-application/confirmation-use-cases/confirmation-code-registration-use-case";
import { UserRegistrationCommand } from "../../auth/auth-application/auth-use-cases/registration-use-case";
import { RegistrationEmailResendingCommand } from "../../auth/auth-application/auth-use-cases/registration-email-resending-use-case";

export const registrEmailResendingAndConfirmIntegrationTest = () => {
    describe('REGISTRATION-EMAIL-RESSENDING-INTEGRATION', () => {
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
                contextTests.sessions.accessTokenUser1Devices[0],
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
        it('RECEIVE - Ожидается внутренний статус код 953...', async () => {
            // Не используем await здесь! Передаем промис в expect
            const command = new RegistrationEmailResendingCommand('nonexistent@example.com');
            console.log('TEST: - email 😡😡😡', command)

            await expect(contextTests.сommandBus.execute(command))
                .rejects
                .toMatchObject({
                    // Убедись, что твой UseCase кидает именно DomainException 
                    // с такими полями, а не просто возвращает объект
                    message: 'Не корректный email!',
                    code: INTERNAL_STATUS_CODE.BAD_REQUEST_INCORECT_E_MAIL
                });
        });
        it('SUCCESS - Ожидается внутренний статус код 900, - Успешное повторное отправление на email сообщение подтвердить регистрацию!', async () => {
            const result = await contextTests.сommandBus.execute(
                new RegistrationEmailResendingCommand(contextTests.users.correctUserEmails[0])
            );
            expect(result.code).toBe(INTERNAL_STATUS_CODE.SUCCESS);
            expect(result.serviceMessage).toBe(`Сообщение успешно отправлено на E-Mail: ${contextTests.users.correctUserEmails[0]}. Проверьте почту и следуйте дальнейшим инструкциям в письме. ${result.data?.expirationISO}`);
            expect(result.data?.expirationISO).toMatch(isoDateRegex); // Проверяет формат строки
            expect(result.done).toEqual(expect.any(Boolean));
        });
        it('ERROR   - Ожидается внутренний статус код 680, - Ошибка если 3 минуты не прошло с момента отправки сообщения!', async () => {
            // 1. Первая отправка (запускает таймер)
            await contextTests.сommandBus.execute(
                new RegistrationEmailResendingCommand(contextTests.users.correctUserEmails[0])
            );
            // 2. Вторая отправка (ожидаем ошибку)
            await expect(contextTests.сommandBus.execute(
                new RegistrationEmailResendingCommand(contextTests.users.correctUserEmails[0])
            ))
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
                    field: 'registration',
                    userId: contextTests.users.createdUsers[0]!.id,
                };
                // Вычисляем время для каждого запроса, отнимая 18 - i*3 минуты
                dataCode.add = new Date(Date.now() - (18 * 60 * 1000) + i * (3 * 60 * 1000)).toISOString();
                // dataCode.minutes = i < 5 ? 3 : 40
                await contextTests.confirmationService.createConfirmationsCodesService(dataCode);
            }
            const command = new RegistrationEmailResendingCommand(contextTests.users.createdUsers[0]!.email)
            await expect(contextTests.сommandBus.execute(command)) // Шестая попытка
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
            await expect(
                contextTests.сommandBus.execute(
                    new RegistrationEmailResendingCommand(contextTests.users.createdUsers[0]!.email)
                )
            )
                .rejects
                .toMatchObject({
                    code: INTERNAL_STATUS_CODE.BAD_REQUEST_FUNCTION_BLOCKED,
                    message: expect.stringMatching(/⛔️ Функция отпрвки сообщения на E-Mail временно заблокирована/) // Твоя регулярка
                });

            // 4. Прыжок еще на 3 минуты (итого 41 минута, блокировка (40 мин) должна спасть)
            jest.setSystemTime(now + 41 * 60 * 1000);
            // 5. Проверяем успех
            const success = await contextTests.сommandBus.execute(
                new RegistrationEmailResendingCommand(contextTests.users.createdUsers[0]!.email)
            );
            expect(success.code).toBe(INTERNAL_STATUS_CODE.SUCCESS);
            expect(success.code).toBe(INTERNAL_STATUS_CODE.SUCCESS);
            expect(success.serviceMessage).toBe(`Сообщение успешно отправлено на E-Mail: ${contextTests.users.correctUserEmails[0]}. Проверьте почту и следуйте дальнейшим инструкциям в письме. ${success.data?.expirationISO}`);
            expect(success.data?.expirationISO).toMatch(isoDateRegex); // Проверяет формат строки
            expect(success.done).toEqual(expect.any(Boolean));
        });
        it('SUCCESS - Ожидается внутренний статус код 900, - Успешное обновление статуса isEmailConfirmed в профиле пользователя!', async () => {
            const data: CreateUserInputDto = {
                avatar: '',
                login: contextTests.users.correctUserNames[1],
                password: contextTests.users.correctUserPasswords[1],
                email: contextTests.users.correctUserEmails[1]
            }
            const command = new UserRegistrationCommand(data, null);
            const createdUser = await contextTests.сommandBus.execute(command);
            const findUser = await contextTests.usersRepository.findUserByIdOrNotFoundFail(createdUser.data.id)
            const addUser = {
                id: findUser.id,
                avatar: null,
                login: findUser.accountData.login,
                email: findUser.accountData.email,
                createdAt: findUser.createdAt,
            }
            if (findUser && createdUser) {
                contextTests.users.addUserStateTest({ numUser: 1, addUser: addUser });
                contextTests.codeConfirmation.addCodeConfirmationStateTest({
                    numConfirmation: 1,
                    nameConfirmation: 'Registration',
                    newCode: createdUser.data.code
                })
                // console.log('TEST: contextTests.createdUser1 😡 ', contextTests.users.createdUsers[1])
            }
            // console.log('TEST: contextTests.codeConfirmation 😡 ', contextTests.codeConfirmation.allCodesConfirmation[0].code)
            const success = await contextTests.сommandBus.execute(
                new ConfirmationCodeRegistrationCommand(contextTests.codeConfirmation.allCodesConfirmation[0].code)
            );
            // console.log('TEST: success 😡 ', success)
            expect(success.code).toBe(INTERNAL_STATUS_CODE.SUCCESS);
            expect(success.data._id.toString()).toBe(contextTests.users.createdUsers[1]!.id);
            expect(success.done).toEqual(expect.any(Boolean));
        });
    });
}
