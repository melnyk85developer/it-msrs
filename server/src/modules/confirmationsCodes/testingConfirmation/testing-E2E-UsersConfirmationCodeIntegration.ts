import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { getConnectionToken } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../../../../src/app-module';
import { ConfirmationService } from '../confirmations-infrastructure/confirmationRepository';
import { UserCreationsAttrs } from '../../../../src/services/users/usersModel';
import { usersTestManager } from '../../../../__tests__/managersTests/usersTestManager';
import { contextTests } from '../../../../__tests__/contextTests';

export const confirmationCodeIntegrationTest = () => {
    describe('CONFIRMATION-CODE-INTEGRATION', () => {
        // let app: INestApplication;
        let confirmationService: any
        let confirmation: any
        let user = null

        beforeEach(() => {
            jest.clearAllMocks();
        });
        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({
                        envFilePath: '.development.env',
                        isGlobal: true,
                    }),
                    AppModule,
                ],
            }).compile();

            contextTests.app = moduleFixture.createNestApplication();
            await contextTests.app.init();

            // Получение подключения к базе данных
            const sequelize = moduleFixture.get<Sequelize>(getConnectionToken());
            // Очистка всех данных из таблиц перед тестами
            await sequelize.sync({ force: true });

            // confirmationService = moduleFixture.get<ConfirmationService>(ConfirmationService)

            const userData: UserCreationsAttrs = {
                name: 'MR - TEST - 1',
                surname: 'ROBOR - TEST - 1',
                password: 'qwerty',
                email: 'magamelnyk85developer@gmail.com',
            };

            const { createdUser } = await usersTestManager.createUser(
                contextTests.app.getHttpServer(),
                userData,
                HttpStatus.CREATED,
            );
            user = createdUser;
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
                userId: user.userId
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
                userId: user.userId
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
            const result = await confirmationService.deleteConfirmationUserIdRepository(user.userId);
            expect(result).toBe(1)
        });
        it('DELETE - Запрос на удаление не существующего кода подтверждения по userId!', async () => {
            const result = await confirmationService.deleteConfirmationUserIdRepository(user.userId);
            expect(result).toBeGreaterThanOrEqual(0);
        });
        it('DELETE - Запрос на удаление кода подтверждения по id!', async () => {
            const result = await confirmationService.deleteConfirmationIdRepository(confirmation.id)
            expect(result).toBeGreaterThanOrEqual(0);
        })
        afterAll(async () => {
            await contextTests.app.close();
        });
    });
}

