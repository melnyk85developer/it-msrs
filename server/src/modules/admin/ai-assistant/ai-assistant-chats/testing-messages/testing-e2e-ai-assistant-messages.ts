import { contextTests } from 'test/helpers/init-settings';
// import { isCreatedMsg1, isCreatedMsg2, isCreatedMsg3 } from './testFuncUserMSG';
import { HTTP_STATUSES } from 'src/core/utils/utils';
import { isCreatedUser } from 'src/modules/user-accounts/testing-users/testFunctionsUser';
import { isLoginUser } from 'src/modules/auth/auth-testing/testFunctionsAuth';

export const aiAssistantsMegsE2eTest = () => {
    // const prepareIsCreated3Msg = async () => {
    //     const msg1 = await isCreatedMsg1(
    //         {
    //             localId: String(Date.now()),
    //             message: `Успешное создание сообщение 1 от пользователя senderId ${contextTests.users.createdUsers[0]!.id} пользователю receiverId ${contextTests.users.createdUsers[1]!.id}`,
    //             senderId: contextTests.users.createdUsers[0]!.id,
    //             receiverId: contextTests.users.createdUsers[1]!.id,
    //             // read: false,
    //             // createdAt: new Date().toISOString(),
    //             replyToMessageId: undefined,
    //             // attachments: contextTests.constants.image1Path,
    //         },
    //         contextTests.sessions.accessTokenUser1Devices[0],
    //         contextTests.sessions.refreshTokenUser1Devices[0],
    //         HTTP_STATUSES.CREATED_201
    //     )
    //     // console.log('isCreatedMsg1 msg1', msg1)
    //     const msg2 = await isCreatedMsg2(
    //         {
    //             localId: String(Date.now()),
    //             message: `Успешное создание сообщение 2 от пользователя senderId ${contextTests.users.createdUsers[1]!.id} пользователю receiverId ${contextTests.users.createdUsers[0]!.id}`,
    //             senderId: contextTests.users.createdUsers[1]!.id,
    //             receiverId: contextTests.users.createdUsers[0]!.id,
    //             // read: false,
    //             // createdAt: new Date().toISOString(),
    //             replyToMessageId: undefined,
    //             // attachments: contextTests.constants.image1Path,
    //         },
    //         contextTests.sessions.accessTokenUser2Devices[0],
    //         contextTests.sessions.refreshTokenUser2Devices[0],
    //         HTTP_STATUSES.CREATED_201
    //     )
    //     // console.log('isCreatedMsg2 msg1', msg2)     
    //     const msg3 = await isCreatedMsg3(
    //         {
    //             localId: String(Date.now()),
    //             message: `Успешное создание сообщение 3 от пользователя senderId ${contextTests.users.createdUsers[0]!.id} пользователю receiverId ${contextTests.users.createdUsers[1]!.id}`,
    //             senderId: contextTests.users.createdUsers[0]!.id,
    //             receiverId: contextTests.users.createdUsers[1]!.id,
    //             // read: false,
    //             // createdAt: new Date().toISOString(),
    //             replyToMessageId: undefined,
    //             // attachments: contextTests.constants.image2Path,
    //         },
    //         contextTests.sessions.accessTokenUser1Devices[0],
    //         contextTests.sessions.refreshTokenUser1Devices[0],
    //         HTTP_STATUSES.CREATED_201
    //     )
    //     // console.log('isCreatedMsg3 msg1', msg3)
    // }
    // const prepareIsCreatedDIalog = async () => {
    //     await prepareIsCreated3Msg()

    //     const { getAllInterlocutors } = await contextTests.userMessagesTestManager.getAllInterlocutors(
    //         contextTests.sessions.accessTokenUser1Devices[0],
    //         contextTests.sessions.refreshTokenUser1Devices[0],
    //         contextTests.sessions.userAgent[1],
    //         HTTP_STATUSES.OK_200
    //     )
    //     expect(getAllInterlocutors.length).toEqual(1);
    //     expect(getAllInterlocutors).toEqual(expect.arrayContaining([]));
    //     contextTests.createdDialog1 = getAllInterlocutors[0].chat
    //     // console.log('TEST: - contextTests.createdDialog1: ', contextTests.createdDialog1)
    //     // console.log('TEST: - contextTests.createdMessage1: ', contextTests.createdMessage1)
    //     // console.log('TEST: - contextTests.createdMessage2: ', contextTests.createdMessage2)
    //     // console.log('TEST: - contextTests.createdMessage3: ', contextTests.createdMessage3)

    //     await contextTests.userMessagesTestManager.deleteAllMessage(
    //         contextTests.sessions.accessTokenUser1Devices[0],
    //         contextTests.sessions.refreshTokenUser1Devices[0],
    //         {
    //             senderId: contextTests.users.createdUsers[0]!.id,
    //             receiverId: contextTests.users.createdUsers[1]!.id,
    //             deleteOption: 'me'
    //         },
    //         contextTests.sessions.userAgent[6],
    //         HTTP_STATUSES.NO_CONTENT_204
    //     )
    // }
    describe('E2E-AI-ASSISTANT-MSG', () => {
        beforeAll(async () => {
            const isUser1 = await isCreatedUser(
                0,
                contextTests.users.correctUserNames[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST usersE2eTest - isUser1: ', isUser1)
            const isLogin1 = await isLoginUser(
                0,
                0,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - blogsE2eTest: isLogin1.status 😡', isLogin1.authData)
            const isUser2 = await isCreatedUser(
                1,
                contextTests.users.correctUserNames[1],
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST: - blogsE2eTest: isUser2 😡', isUser2)
            const isLogin2 = await isLoginUser(
                1,
                0,
                contextTests.sessions.accessTokenUser1Devices[1],
                contextTests.sessions.refreshTokenUser1Devices[1],
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                contextTests.sessions.userAgent[1],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - blogsE2eTest: isLogin2.status 😡', isLogin2.authData)
            const isUser3 = await isCreatedUser(
                2,
                contextTests.users.correctUserNames[2],
                contextTests.users.correctUserEmails[2],
                contextTests.users.correctUserPasswords[2],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST: - blogsE2eTest: isUser3 😡', isUser3)
            const isLogin3 = await isLoginUser(
                2,
                0,
                contextTests.sessions.accessTokenUser1Devices[2],
                contextTests.sessions.refreshTokenUser1Devices[2],
                contextTests.users.correctUserEmails[2],
                contextTests.users.correctUserPasswords[2],
                contextTests.sessions.userAgent[2],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - blogsE2eTest: isLogin3.status 😡', isLogin3.authData)
        })
        it('GET    - Ожидается статус код 200, - Запрос на всех собеседников - теле ответа ожидаем пустой массив!', async () => {
            const { response } = await contextTests.userMessagesTestManager.getAllInterlocutors(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                contextTests.sessions.userAgent[1],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body.items).toEqual(expect.arrayContaining([]));
            expect(response.body.items).toEqual([])
        })
        // it('GET    - Ожидается статус код 404, - Запрос на не существующий диалог!', async () => {
        //     await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.constants.invalidId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[2],
        //         HTTP_STATUSES.NOT_FOUND_404
        //     )
        // })
        // it('GET    - Ожидается статус код 400, - Не валидный запрос на получение диалога с сообщениями!', async () => {
        //     await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.constants.invalidId,
        //         contextTests.constants.invalidId,
        //         undefined,
        //         contextTests.sessions.userAgent[3],
        //         HTTP_STATUSES.BAD_REQUEST_400
        //     )
        // })

        // it(`POST   - Ожидается статус код 400, - Не валидный запрос на создание сообщения ! Дополнительные запросы: -> GET, POST`, async () => {
        //     const message = {
        //         message: '',
        //         senderId: contextTests.users.createdUsers[0]!.id,
        //         receiverId: contextTests.users.createdUsers[1]!.id,
        //         read: false,
        //         createdAt: new Date().toISOString(),
        //         replyToMessageId: null,
        //         attachments: contextTests.constants.image1Path,
        //         localId: Date.now(),
        //     };

        //     await contextTests.userMessagesTestManager.createMessage(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         message,
        //         contextTests.sessions.userAgent[4],
        //         HTTP_STATUSES.BAD_REQUEST_400
        //     )
        // })
        // it(`POST   - Ожидается статус код 401, - Попытка без авторизации создать сообщение! Дополнительные запросы: -> GET, POST`, async () => {
        //     await isCreatedMsg1(
        //         {
        //             localId: String(Date.now()),
        //             message: `UNAUTHORIZED_401 ${contextTests.users.createdUsers[0]!.id} пользователю receiverId ${contextTests.users.createdUsers[1]!.id}`,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             replyToMessageId: undefined,
        //             // attachments: contextTests.constants.image2Path,
        //         },
        //         contextTests.constants.expiredToken,
        //         contextTests.constants.expiredToken,
        //         HTTP_STATUSES.UNAUTHORIZED_401
        //     )
        // })
        // it(`POST   - Ожидается статус код 201, - Успешное создание сообщения 1 (user 1 => user 2)! Дополнительные запросы: -> GET, POST`, async () => {
        //     const msg1 = await isCreatedMsg1(
        //         {
        //             localId: String(Date.now()),
        //             message: `Успешное создание сообщение 1 от пользователя senderId ${contextTests.users.createdUsers[0]!.id} пользователю receiverId ${contextTests.users.createdUsers[1]!.id}`,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             replyToMessageId: undefined,
        //             // attachments: contextTests.constants.image2Path,
        //         },
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         HTTP_STATUSES.CREATED_201
        //     )
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[7],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - getEntity', getEntity)
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.createdMessage1.senderId,
        //             receiverId: contextTests.createdMessage1.receiverId,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: null,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);

        //     const { getAllInterlocutors } = await contextTests.userMessagesTestManager.getAllInterlocutors(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.sessions.userAgent[1],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - getAllInterlocutors', getAllInterlocutors.items[0].chat)
        //     contextTests.createdDialog1 = getAllInterlocutors.items[0].chat
        //     expect(getAllInterlocutors.items.length).toEqual(1);
        //     expect(getAllInterlocutors.items).toEqual(expect.arrayContaining([]));
        // })
        // it(`POST   - Ожидается статус код 201, - Успешное создание сообщения 2 (user 2 => user 1)! Дополнительные запросы: -> GET`, async () => {
        //     const msg2 = await isCreatedMsg2(
        //         {
        //             localId: String(Date.now()),
        //             message: `Успешное создание сообщение 2 от пользователя senderId ${contextTests.users.createdUsers[1]!.id} пользователю receiverId ${contextTests.users.createdUsers[0]!.id}`,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             // read: false,
        //             // createdAt: new Date().toISOString(),
        //             // replyToMessageId: null,
        //             // attachments: contextTests.constants.image1Path,
        //         },
        //         contextTests.sessions.accessTokenUser2Devices[0],
        //         contextTests.sessions.refreshTokenUser2Devices[0],
        //         HTTP_STATUSES.CREATED_201
        //     )
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[9],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })

        // it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления сообщения! Дополнительные запросы: -> POST, GET`, async () => {
        //     // await prepareIsCreated3Msg()
        //     const message = {
        //         localId: String(Date.now()),
        //         msgId: contextTests.createdMessage1.msgId,
        //         message: '',
        //         senderId: contextTests.users.createdUsers[0]!.id,
        //         receiverId: contextTests.users.createdUsers[1]!.id,
        //         replyToMessageId: null,
        //         // attachments: contextTests.constants.image1Path,
        //     };

        //     const { updatedEntity } = await contextTests.userMessagesTestManager.updateMessage(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         message,
        //         contextTests.sessions.userAgent[10],
        //         HTTP_STATUSES.BAD_REQUEST_400
        //     )
        // })

        // it(`PUT    - Ожидается статус код 401, - Попытка без авторизации обновить сообщение! Дополнительные запросы: -> POST, GET`, async () => {
        //     const message = {
        //         localId: String(Date.now()),
        //         msgId: contextTests.createdMessage1.msgId,
        //         message: 'UNAUTHORIZED_401',
        //         senderId: contextTests.users.createdUsers[0]!.id,
        //         receiverId: contextTests.users.createdUsers[1]!.id,
        //         replyToMessageId: null,
        //         // attachments: contextTests.constants.image2Path,
        //     };

        //     await contextTests.userMessagesTestManager.updateMessage(
        //         contextTests.constants.expiredToken,
        //         '',
        //         message,
        //         contextTests.sessions.userAgent[0],
        //         HTTP_STATUSES.UNAUTHORIZED_401
        //     )
        // })
        // it(`PUT    - Ожидается статус код 403, - Попытка обновления чужого сообщения! Дополнительные запросы: -> GET`, async () => {
        //     const message = {
        //         localId: String(Date.now()),
        //         msgId: contextTests.createdMessage1.msgId,
        //         message: 'FORBIDDEN_403',
        //         senderId: contextTests.users.createdUsers[0]!.id,
        //         receiverId: contextTests.users.createdUsers[1]!.id,
        //         replyToMessageId: undefined,
        //         // attachments: contextTests.constants.image1Path,
        //     };
        //     await contextTests.userMessagesTestManager.updateMessage(
        //         contextTests.sessions.accessTokenUser2Devices[0],
        //         contextTests.sessions.refreshTokenUser2Devices[0],
        //         message,
        //         contextTests.sessions.userAgent[1],
        //         HTTP_STATUSES.FORBIDDEN_403
        //     )
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[2],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })
        // it(`PUT    - Ожидается статус код 404, - Обновление не существующего сообщения!`, async () => {
        //     const message = {
        //         localId: String(Date.now()),
        //         msgId: contextTests.constants.invalidId,
        //         message: 'NOT_FOUND_404',
        //         senderId: contextTests.users.createdUsers[0]!.id,
        //         receiverId: contextTests.users.createdUsers[1]!.id,
        //         replyToMessageId: undefined,
        //         // attachments: contextTests.constants.image2Path,
        //     };
        //     await contextTests.userMessagesTestManager.updateMessage(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         message,
        //         contextTests.sessions.userAgent[3],
        //         HTTP_STATUSES.NOT_FOUND_404
        //     )
        // })
        // it(`PUT    - Ожидается статус код 200, - Обновление сообщения с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
        //     const message = {
        //         localId: String(Date.now()),
        //         msgId: contextTests.createdMessage1.msgId,
        //         message: 'Обновляем сообщение 1',
        //         senderId: contextTests.users.createdUsers[0]!.id,
        //         receiverId: contextTests.users.createdUsers[1]!.id,
        //         replyToMessageId: undefined,
        //         // attachments: contextTests.constants.image1Path
        //     };
        //     const { updatedEntity } = await contextTests.userMessagesTestManager.updateMessage(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         message,
        //         contextTests.sessions.userAgent[4],
        //         HTTP_STATUSES.OK_200
        //     )
        //     contextTests.createdMessage1 = updatedEntity
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: message.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })

        // it(`PUT    - Ожидается статус код 400, - Не валидное обновление статуса просмотрено! Дополнительные запросы: -> GET`, async () => {
        //     await contextTests.userMessagesTestManager.updateRead(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         {
        //             msgId: '',
        //             read: true,
        //         },
        //         contextTests.sessions.userAgent[4],
        //         HTTP_STATUSES.BAD_REQUEST_400
        //     )
        //     await contextTests.userMessagesTestManager.updateRead(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             read: null,
        //         },
        //         contextTests.sessions.userAgent[4],
        //         HTTP_STATUSES.BAD_REQUEST_400
        //     )
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })
        // it(`PUT    - Ожидается статус код 401, - Обновление статуса просмотрено! Дополнительные запросы: -> GET`, async () => {
        //     const message = {
        //         msgId: contextTests.createdMessage2.msgId,
        //         read: true,
        //     };
        //     const { updatedEntity } = await contextTests.userMessagesTestManager.updateRead(
        //         contextTests.constants.expiredToken,
        //         contextTests.constants.expiredToken,
        //         message,
        //         contextTests.sessions.userAgent[4],
        //         HTTP_STATUSES.UNAUTHORIZED_401
        //     )
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: message.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })
        // it(`PUT    - Ожидается статус код 403, - Обновление статуса просмотрено чужого сообщения! Дополнительные запросы: -> GET`, async () => {
        //     await contextTests.userMessagesTestManager.updateRead(
        //         contextTests.sessions.accessTokenUser3Devices[0],
        //         contextTests.sessions.refreshTokenUser3Devices[0],
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             read: true,
        //         },
        //         contextTests.sessions.userAgent[8],
        //         HTTP_STATUSES.FORBIDDEN_403
        //     )

        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })
        // it(`PUT    - Ожидается статус код 404, - Обновление статуса просмотрено не существующего сообщения! Дополнительные запросы: -> GET`, async () => {
        //     await contextTests.userMessagesTestManager.updateRead(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         {
        //             msgId: contextTests.constants.invalidId,
        //             read: true,
        //         },
        //         contextTests.sessions.userAgent[4],
        //         HTTP_STATUSES.NOT_FOUND_404
        //     )

        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })
        // it(`PUT    - Ожидается статус код 200, - Обновление статуса просмотрено! Дополнительные запросы: -> GET`, async () => {
        //     const message = {
        //         msgId: contextTests.createdMessage2.msgId,
        //         read: true,
        //     };
        //     const { response } = await contextTests.userMessagesTestManager.updateRead(
        //         contextTests.sessions.accessTokenUser2Devices[0],
        //         contextTests.sessions.refreshTokenUser2Devices[0],
        //         message,
        //         contextTests.sessions.userAgent[4],
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
        //         contextTests.createdMessage2.read = true
        //     }
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: message.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: message.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })

        // it(`DELETE - Ожидается статус код 400, - Не валидные данные при удалении сообщения! Дополнительные запросы: -> GET`, async () => {
        //     const incorectData = [
        //         undefined, null, NaN, {},
        //         '@', '"', '&', '*', '(', ')', '=', '+', ';', ':', '<', '>', ',', '`', '~', '!', '^', '$', '-', 'a', 'A',
        //         // '?', [], '%', '#', '/', '.',
        //     ]

        //     for (let i = 0; incorectData.length > i; i++) {
        //         await contextTests.userMessagesTestManager.deleteMessageById(
        //             contextTests.sessions.accessTokenUser1Devices[0],
        //             contextTests.sessions.refreshTokenUser1Devices[0],
        //             incorectData[i] as string,
        //             'all',
        //             contextTests.sessions.userAgent[6],
        //             HTTP_STATUSES.BAD_REQUEST_400
        //         )
        //     }
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg.length).toEqual(2);
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })
        // it(`DELETE - Ожидается статус код 401, - Попытка удаления сообщения без авторизации! Дополнительные запросы: -> GET`, async () => {
        //     await contextTests.userMessagesTestManager.deleteMessageById(
        //         contextTests.constants.expiredToken,
        //         contextTests.constants.expiredToken,
        //         contextTests.createdMessage1.msgId,
        //         'all',
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.UNAUTHORIZED_401
        //     )
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })
        // it(`DELETE - Ожидается статус код 403, - Попытка удаления чужого сообщения! Дополнительные запросы: -> GET`, async () => {
        //     await contextTests.userMessagesTestManager.deleteMessageById(
        //         contextTests.sessions.accessTokenUser3Devices[0],
        //         contextTests.sessions.refreshTokenUser3Devices[0],
        //         contextTests.createdMessage1.msgId,
        //         'all',
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.FORBIDDEN_403
        //     )

        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage1.read,
        //             dialogId: contextTests.createdMessage1.dialogId,
        //             replyToMessageId: contextTests.createdMessage1.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);
        // })
        // it(`DELETE - Ожидается статус код 404, - Попытка удаления не существующего сообщения!`, async () => {
        //     await contextTests.userMessagesTestManager.deleteMessageById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.constants.invalidId,
        //         'all',
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.NOT_FOUND_404
        //     )
        // })
        // it(`DELETE - Ожидается статус код 204, - Должен удалить оба сообщения! Дополнительные запросы: -> GET`, async () => {
        //     await contextTests.userMessagesTestManager.deleteMessageById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.msgId,
        //         'all',
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);

        //     const { response } = await contextTests.userMessagesTestManager.deleteMessageById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage2.msgId,
        //         'all',
        //         contextTests.sessions.userAgent[10],
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getEntity: getMsg } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[5],
        //         HTTP_STATUSES.OK_200
        //     )
        //     if (response.statusCode === HTTP_STATUSES.NO_CONTENT_204) {
        //         contextTests.createdMessage1 = null
        //         contextTests.createdMessage2 = null
        //     }
        //     expect(getMsg.allMsg).toEqual([])
        //     expect(getMsg.allMsg.length).toEqual(0);
        //     expect(getMsg.allMsg).toEqual(expect.arrayContaining([]));
        // })

        // it(`DELETE - Ожидается статус код 400, - Не валидные данные при удалении всей переписки! Дополнительные запросы: -> GET, POST`, async () => {
        //     await prepareIsCreated3Msg()
        //     // console.log('TEST: msg3 - ', msg3)
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[7],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - ', response.body.allMsg)
        //     expect(getEntity.allMsg.length).toEqual(3);
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage3.msgId,
        //             message: contextTests.createdMessage3.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage3.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);

        //     const incorectData = [
        //         undefined, null, NaN, {},
        //         '@', '"', '&', '*', '(', ')', '=', '+', ';', ':', '<', '>', ',', '.', '`', '~', '!', '^', '$', '-', 'a', 'A',
        //         // '?', [], '%', '#', '/',
        //     ]

        //     for (let i = 0; incorectData.length > i; i++) {
        //         await contextTests.userMessagesTestManager.deleteAllMessage(
        //             contextTests.sessions.accessTokenUser1Devices[0],
        //             contextTests.sessions.refreshTokenUser1Devices[0],
        //             {
        //                 senderId: incorectData[i] as any,
        //                 receiverId: contextTests.users.createdUsers[1]!.id,
        //                 deleteOption: 'all'
        //             },
        //             contextTests.sessions.userAgent[6],
        //             HTTP_STATUSES.BAD_REQUEST_400
        //         )
        //         await contextTests.userMessagesTestManager.deleteAllMessage(
        //             contextTests.sessions.accessTokenUser1Devices[0],
        //             contextTests.sessions.refreshTokenUser1Devices[0],
        //             {
        //                 senderId: contextTests.users.createdUsers[0]!.id,
        //                 receiverId: incorectData[i] as any,
        //                 deleteOption: 'all'
        //             },
        //             contextTests.sessions.userAgent[6],
        //             HTTP_STATUSES.BAD_REQUEST_400
        //         )
        //     }
        //     const { response } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[7],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - ', response.body.allMsg)
        //     expect(response.body.allMsg).toEqual(expect.arrayContaining([]));
        //     expect(response.body.allMsg.length).toEqual(3);
        // })

        // it(`DELETE - Ожидается статус код 401, - Попытка удаления всей переписки без авторизации! Дополнительные запросы: -> GET, POST`, async () => {
        //     await prepareIsCreated3Msg()
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[7],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - ', response.body.allMsg)
        //     expect(getEntity.allMsg.length).toEqual(3);
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage3.msgId,
        //             message: contextTests.createdMessage3.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage3.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);

        //     await contextTests.userMessagesTestManager.deleteAllMessage(
        //         contextTests.constants.expiredToken,
        //         contextTests.constants.expiredToken,
        //         {
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             deleteOption: 'all'
        //         },
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.UNAUTHORIZED_401
        //     )
        //     const { response } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[7],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - ', response.body.allMsg)
        //     expect(response.body.allMsg).toEqual(expect.arrayContaining([]));
        //     expect(response.body.allMsg.length).toEqual(3);
        // })
        // it(`DELETE - Ожидается статус код 403, - Попытка удаления чужой переписки! Дополнительные запросы: -> GET, POST`, async () => {
        //     await prepareIsCreated3Msg()
        //     // console.log('TEST: msg3 - ', msg3)
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[7],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - ', response.body.allMsg)
        //     expect(getEntity.allMsg.length).toEqual(3);
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage3.msgId,
        //             message: contextTests.createdMessage3.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage3.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);

        //     await contextTests.userMessagesTestManager.deleteAllMessage(
        //         contextTests.sessions.accessTokenUser3Devices[0],
        //         contextTests.sessions.refreshTokenUser3Devices[0],
        //         {
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             deleteOption: 'all'
        //         },
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.FORBIDDEN_403
        //     )
        //     const { response } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[7],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - ', response.body.allMsg)
        //     expect(response.body.allMsg).toEqual(expect.arrayContaining([]));
        //     expect(response.body.allMsg.length).toEqual(3);
        // })
        // it(`DELETE - Ожидается статус код 204, - Должен удалить всю переписку! Дополнительные запросы: -> GET, POST`, async () => {
        //     await prepareIsCreated3Msg()
        //     // console.log('TEST: msg3 - ', msg3)
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[7],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - ', response.body.allMsg)
        //     expect(getEntity.allMsg.length).toEqual(3);
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage3.msgId,
        //             message: contextTests.createdMessage3.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage3.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);

        //     const { response: res } = await contextTests.userMessagesTestManager.deleteAllMessage(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         {
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             deleteOption: 'all'
        //         },
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { response } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[7],
        //         HTTP_STATUSES.OK_200
        //     )
        //     if (res.statusCode === HTTP_STATUSES.NO_CONTENT_204 && response.body.allMsg.length === 0) {
        //         contextTests.createdMessage1 = null
        //         contextTests.createdMessage2 = null
        //         contextTests.createdMessage3 = null
        //     }
        //     // console.log('TEST: - ', response.body.allMsg)
        //     expect(response.body.allMsg).toEqual(expect.arrayContaining([]));
        //     expect(response.body.allMsg).toEqual([])
        //     expect(response.body.allMsg.length).toEqual(0);
        // })
        // it(`DELETE - Ожидается статус код 404, - Попытка удаления не существующей переписки! Дополнительные запросы: -> GET, POST, DELETE`, async () => {
        //     await prepareIsCreated3Msg()
        //     const { getEntity } = await contextTests.userMessagesTestManager.getInterlocutorById(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdMessage1.dialogId,
        //         contextTests.users.createdUsers[0]!.id,
        //         contextTests.users.createdUsers[1]!.id,
        //         contextTests.sessions.userAgent[7],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getEntity.allMsg.length).toEqual(3);
        //     expect(getEntity.allMsg).toEqual([
        //         {
        //             msgId: contextTests.createdMessage1.msgId,
        //             message: contextTests.createdMessage1.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage2.msgId,
        //             message: contextTests.createdMessage2.message,
        //             senderId: contextTests.users.createdUsers[1]!.id,
        //             receiverId: contextTests.users.createdUsers[0]!.id,
        //             read: contextTests.createdMessage2.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         },
        //         {
        //             msgId: contextTests.createdMessage3.msgId,
        //             message: contextTests.createdMessage3.message,
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             read: contextTests.createdMessage3.read,
        //             dialogId: contextTests.createdMessage2.dialogId,
        //             replyToMessageId: contextTests.createdMessage2.replyToMessageId,
        //             createdAt: expect.any(String),
        //             updatedAt: expect.any(String)
        //         }
        //     ]);

        //     await contextTests.userMessagesTestManager.deleteAllMessage(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         {
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             deleteOption: 'all'
        //         },
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )

        //     const { response } = await contextTests.userMessagesTestManager.deleteAllMessage(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         {
        //             senderId: contextTests.users.createdUsers[0]!.id,
        //             receiverId: contextTests.users.createdUsers[1]!.id,
        //             deleteOption: 'all'
        //         },
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.NOT_FOUND_404
        //     )
        //     if (response.statusCode === HTTP_STATUSES.NOT_FOUND_404) {
        //         contextTests.createdMessage1 = null
        //         contextTests.createdMessage2 = null
        //         contextTests.createdMessage3 = null
        //     }
        // })

        // it(`DELETE - Ожидается статус код 400, - Не валидные данные при удалении диалога с собеседником! Дополнительные запросы: -> GET, POST`, async () => {
        //     // await prepareIsCreatedDIalog()
        //     await contextTests.userMessagesTestManager.deleteDialog(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         undefined,
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.BAD_REQUEST_400
        //     )
        //     const { response } = await contextTests.userMessagesTestManager.getAllInterlocutors(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.sessions.userAgent[1],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('😳😳 TEST: dialogId - response.body', response.body)
        //     expect(response.body.items).toEqual(expect.arrayContaining([]));
        //     expect(response.body.items.length).toEqual(1);
        //     expect(response.body.items).toEqual([
        //         {
        //             userId: contextTests.users.createdUsers[1]!.id,
        //             // login: contextTests.users.createdUsers[1]!.login,
        //             // email: contextTests.users.createdUsers[1]!.email,
        //             // avatar: contextTests.users.createdUsers[1]!.avatar,
        //             chat: contextTests.createdDialog1,
        //             lastMessage: {},
        //             name: null,
        //             surname: null
        //         }
        //     ])
        // })
        // it(`DELETE - Ожидается статус код 401, - Удаление диалога с собеседником без авторизации! Дополнительные запросы: -> GET, POST`, async () => {
        //     // await prepareIsCreatedDIalog()
        //     await contextTests.userMessagesTestManager.deleteDialog(
        //         contextTests.constants.expiredToken,
        //         contextTests.constants.expiredToken,
        //         contextTests.createdDialog1.dialogId,
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.UNAUTHORIZED_401
        //     )
        //     const { response } = await contextTests.userMessagesTestManager.getAllInterlocutors(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.sessions.userAgent[1],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('😳😳 TEST: dialogId - response.body', response.body)
        //     expect(response.body.items).toEqual(expect.arrayContaining([]));
        //     expect(response.body.items.length).toEqual(1);
        //     expect(response.body.items).toEqual([
        //         {
        //             userId: contextTests.users.createdUsers[1]!.id,
        //             // login: contextTests.users.createdUsers[1]!.login,
        //             // email: contextTests.users.createdUsers[1]!.email,
        //             // avatar: contextTests.users.createdUsers[1]!.avatar,
        //             chat: contextTests.createdDialog1,
        //             lastMessage: {},
        //             name: null,
        //             surname: null
        //         }
        //     ])
        // })
        // it(`DELETE - Ожидается статус код 404, - Удаление не существующего диалога! Дополнительные запросы: -> GET, POST`, async () => {
        //     await contextTests.userMessagesTestManager.deleteDialog(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.constants.invalidId,
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.NOT_FOUND_404
        //     )
        // })
        // it(`DELETE - Ожидается статус код 403, - Попытка удаления чужого диалога! Дополнительные запросы: -> GET, POST`, async () => {
        //     // await prepareIsCreatedDIalog()
        //     const { getAllInterlocutors } = await contextTests.userMessagesTestManager.getAllInterlocutors(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.sessions.userAgent[1],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getAllInterlocutors.items.length).toEqual(1);
        //     expect(getAllInterlocutors.items).toEqual(expect.arrayContaining([]));

        //     await contextTests.userMessagesTestManager.deleteDialog(
        //         contextTests.sessions.accessTokenUser3Devices[0],
        //         contextTests.sessions.refreshTokenUser3Devices[0],
        //         contextTests.createdDialog1.dialogId,
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.FORBIDDEN_403
        //     )

        //     const { response } = await contextTests.userMessagesTestManager.getAllInterlocutors(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.sessions.userAgent[1],
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(response.body.items.length).toEqual(1);
        //     expect(response.body.items).toEqual(expect.arrayContaining([]));
        // })
        // it(`DELETE - Ожидается статус код 204, - Должен удалить весь диалог с собеседником! Дополнительные запросы: -> GET, POST`, async () => {
        //     // await prepareIsCreatedDIalog()
        //     const { getAllInterlocutors } = await contextTests.userMessagesTestManager.getAllInterlocutors(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.sessions.userAgent[1],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - ', getAllInterlocutors)
        //     expect(getAllInterlocutors.items.length).toEqual(1);
        //     expect(getAllInterlocutors.items).toEqual(expect.arrayContaining([]));

        //     await contextTests.userMessagesTestManager.deleteDialog(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.createdDialog1.dialogId,
        //         contextTests.sessions.userAgent[6],
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )

        //     const { response } = await contextTests.userMessagesTestManager.getAllInterlocutors(
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.sessions.userAgent[1],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST: - ', getAllInterlocutors)
        //     expect(response.body.items).toEqual([])
        //     expect(response.body.items.length).toEqual(0);
        //     expect(response.body.items).toEqual(expect.arrayContaining([]));
        // })
    })
}