import { contextTests } from 'test/helpers/init-settings';
import { HTTP_STATUSES } from 'src/core/utils/utils';
import { CreateUserInputDto } from '../../user.accounts/users-dto/users.input-dto';

describe('CONFIRMATION-CODE-INTEGRATION', () => {
    let confirmationService: any
    let confirmation: any

    beforeEach(() => {
        jest.clearAllMocks();
    });
    beforeAll(async () => {
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
    });
    it('GET  - Ожидается статус код 200, - В теле ответа ожидаем пустой массив!', async () => {
        await confirmationService.findAllConfirmationRepository()
        expect.arrayContaining([])
    });
    it('GET  - Ожидается статус код 404, - Запрос на не существующий код!', async () => {
        const result = await confirmationService.findByCodeConfirmationRepository('245678901245678901123456')
        expect(result).toBeNull()
    })
    it('POST - Ожидается успешный запрос на создание кода подтверждения!', async () => {
        const dataCode = {
            confirmationCode: '245678901245678901123456',
            expirationDate: new Date(),
            isBlocked: true,
            field: 'password',
            userId: contextTests.users.createdUsers[0]!.id
        };

        const result = await confirmationService.createConfirmationRepository(dataCode);
        confirmation = result.dataValues;

        expect(confirmation).toBeDefined();
        expect(confirmation).toMatchObject({
            confirmationCode: dataCode.confirmationCode,
            isBlocked: dataCode.isBlocked,
            field: dataCode.field,
            userId: dataCode.userId,
        });

        expect(confirmation.id).toBeDefined();
        expect(confirmation.createdAt).toBeInstanceOf(Date);
        expect(confirmation.updatedAt).toBeInstanceOf(Date);
        expect(confirmation.expirationDate).toBeInstanceOf(Date);
        expect(new Date(confirmation.expirationDate).getTime()).toBeCloseTo(dataCode.expirationDate.getTime(), -2);
    });
    it('PUT  - Успешный запрос на обновление кода подтверждения по userId!', async () => {
        const dataCode = {
            confirmationCode: '245678901245678901123456',
            expirationDate: new Date(),
            isBlocked: false,
            field: 'password',
            userId: contextTests.users.createdUsers[0]!.id
        };
        const result = await confirmationService.updateConfirmationRepository(confirmation.id, dataCode);
        const updatedConfirmation = result.dataValues;
        expect(updatedConfirmation).toBeDefined();
        expect(updatedConfirmation).toMatchObject({
            confirmationCode: dataCode.confirmationCode,
            isBlocked: dataCode.isBlocked,
            field: dataCode.field,
            userId: dataCode.userId,
        });
        expect(updatedConfirmation.id).toBe(confirmation.id);
        expect(updatedConfirmation.createdAt).toBeInstanceOf(Date);
        expect(updatedConfirmation.updatedAt).toBeInstanceOf(Date);
        expect(updatedConfirmation.expirationDate).toBeInstanceOf(Date);
        expect(new Date(updatedConfirmation.expirationDate).getTime()).toBeCloseTo(dataCode.expirationDate.getTime(), -2);
        expect(new Date(updatedConfirmation.updatedAt).getTime()).toBeGreaterThan(new Date(confirmation.updatedAt).getTime());
    });
    it('DELETE - Запрос на удаление кода подтверждения по userId!', async () => {
        const result = await confirmationService.deleteConfirmationUserIdRepository(
            contextTests.users.createdUsers[0]!.id
        );
        expect(result).toBe(1)
    });
    it('DELETE - Запрос на удаление не существующего кода подтверждения по userId!', async () => {
        const result = await confirmationService.deleteConfirmationUserIdRepository(
            contextTests.users.createdUsers[0]!.id
        );
        expect(result).toBeGreaterThanOrEqual(0);
    });
    it('DELETE - Запрос на удаление кода подтверждения по id!', async () => {
        const result = await confirmationService.deleteConfirmationIdRepository(confirmation.id)
        expect(result).toBeGreaterThanOrEqual(0);
    })
});

