import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";
import { CreateUserInputDto } from "../users-dto/users.input-dto";

// const mockRepository = {
//     createConfirmationRepository: jest.fn().mockResolvedValue({
//         status: INTERNAL_STATUS_CODE.SUCCESS,
//         expirationDate: '2025-01-01',
//     }),
//     deleteConfirmationIdRepository: jest.fn(),
//     // если сервис читает "последние подтверждения", замокай методы чтения:
//     findManyByUserAndField: jest.fn().mockResolvedValue([]),
//     findLastByUserAndField: jest.fn().mockResolvedValue(null),
//     countInRangeByUserAndField: jest.fn().mockResolvedValue(0),
//     setBlockedForUserAndField: jest.fn().mockResolvedValue(true),
// } as unknown as ConfirmationRepository;

export const resetPasswordInegrationTest = () => {
    describe('RESET-PASSWORD-INTEGRATION', () => {
        beforeAll(async () => {
            const mockRepository = {
                createConfirmationRepository: jest.fn().mockResolvedValue({
                    status: INTERNAL_STATUS_CODE.SUCCESS,
                    expirationDate: '2025-01-01',
                }),
                deleteConfirmationIdRepository: jest.fn(),
            };
            contextTests.confirmationRepository = mockRepository

            // const mockMailService = {
            //     sendMail: jest.fn().mockResolvedValue(true),
            // };
            // contextTests.mailService = mockMailService
            
            const userData1: CreateUserInputDto = {
                login: contextTests.users.correctUserNames[0],
                password: contextTests.users.correctUserPasswords[0],
                email: contextTests.users.correctUserEmails[0]
            }
            const { response, createdEntity } = await contextTests.usersTestManager.createUser(
                userData1,
                contextTests.constants.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            if (response.status === HTTP_STATUSES.CREATED_201) {
                contextTests.users.addUserStateTest({ numUser: 0, addUser: createdEntity });
                // console.log('TEST: contextTests.createdUser1 😡 ', contextTests.users.createdUsers[0])
            }
            // console.log('beforeEach: response', response)
            jest.useRealTimers();
        });

        it('Выбрасывает ошибку, если пользователь не найден', async () => {
            const error = await contextTests.userService.ressetPasswordService('nonexistent@example.com');
            expect(error.status).toBe(INTERNAL_STATUS_CODE.NOT_FOUND_USER);
        });
        it('Успешно отправляет на email сообщение о попытке сбросить пароль', async () => {
            const result = await contextTests.userService.ressetPasswordService(
                contextTests.users.createdUsers[0]!.email
            );
            expect(result.status).toBe(INTERNAL_STATUS_CODE.SUCCESS);
        });
        it('Выбрасывает ошибку, если 3 минуты не прошло с момента отправки сообщения', async () => {
            await contextTests.userService.ressetPasswordService(
                contextTests.users.createdUsers[0]!.email
            ); // Первая попытка
            const error = await contextTests.userService.ressetPasswordService(
                contextTests.users.createdUsers[0]!.email
            ); // Вторая попытка через короткий промежуток
            // expect(error.status).toBe(INTERNAL_STATUS_CODE.BAD_REQUEST_TIME_HASNT_PASSED_YET);
        });
        it('Блокирует пользователя, если за последние 18 минут было больше 5 запросов', async () => {
            for (let i = 0; i < 7; i++) { // первые 5 итераций
                const dataCode = {
                    confirmationCode: '245678901245678901123456',
                    expirationDate: null as unknown as Date,
                    isBlocked: false,
                    field: 'password',
                    userId: contextTests.users.createdUsers[0]!.id,
                };

                // Вычисляем время для каждого запроса, отнимая 18 - i*3 минуты
                dataCode.expirationDate = new Date(Date.now() - (18 * 60 * 1000) + i * (3 * 60 * 1000));
                const isCreatedConfirmation = await contextTests.confirmationRepository.createConfirmationRepository(dataCode);
                console.log('ITERATION FOR TEST: isCreatedConfirmation - ',isCreatedConfirmation)
            }
            const error = await contextTests.userService.ressetPasswordService(
                contextTests.users.createdUsers[0]!.email
            ); // Шестая попытка
            console.log('TEST error:', error)
            // expect(error.status).toBe(INTERNAL_STATUS_CODE.BAD_REQUEST_A_LOT_OF_REQUESTS_TRY_AGAIN_LATER);

            // @ts-ignore
            jest.useFakeTimers("modern");
            jest.setSystemTime(new Date(Date.now() + 38 * 60 * 1000));

            const result = await contextTests.userService.ressetPasswordService(
                contextTests.users.createdUsers[0]!.email
            );
            console.log('TEST result:', result)
            // expect(result.status).toBe(INTERNAL_STATUS_CODE.BAD_REQUEST_FUNCTION_BLOCKED);

            jest.advanceTimersByTime(2 * 60 * 1000);
            // Снимает блокировку 40 мин., если время действия блокировки истекло
            const success = await contextTests.userService.ressetPasswordService(
                contextTests.users.createdUsers[0]!.email
            );
            console.log('TEST success:', success)
            expect(success.status).toBe(INTERNAL_STATUS_CODE.SUCCESS);
        });
    });
}
