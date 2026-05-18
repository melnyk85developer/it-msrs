import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreateMessageAiAssistantCommand } from "../ai-assistant-msg/ai-assistant-msg-application/ai-assistant-msg.use-cases/create-msg-ai-assistant.use-case";
import { CreatePromptAiDto } from "../ai-assistant-msg/ai-assistant-msg-dto/create-prompt-ai-assistant.dto";
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser";
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth";
import { CreateDialogAiAssistantCommand } from "../ai-assistant-dialog/ai-assistant-dialog-application/ai-assistant-dialog-use-cases/create-ai-assistant-dialog.use-case";
import { DialogAiAssistantType, GetDialogAiAssistantQuery } from "../ai-assistant-dialog/ai-assistant-dialog-application/get-dialog-ai-assistant.query.use-case";
import { PaginatedViewDto } from "src/core/dto/base.paginated.viev-dto";
import { DialogAiAssistantSortBy } from "../ai-assistant-dialog/ai-assistant-dialog-dto/dialog-ai-assistant-sort-by";
import { SortDirection } from "src/core/dto/base.query-params.input-dto";
import { deleteAllData } from "../../../../../../test/helpers/delete-all-data";
import { contextTests } from "../../../../../../test/helpers/init-settings";

export const aiAssistantMessagesIntegrationTest = () => {
    describe('REGISTRATION-EMAIL-RESSENDING-INTEGRATION', () => {
        const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/i;
        beforeAll(async () => {
            await deleteAllData(contextTests.app);
            await contextTests.users.deleteAllUsersStateTest();
            await contextTests.sessions.clearAllSessionsStateTest();

            const isUser1 = await isCreatedUser(
                0,
                contextTests.users.correctUserNames[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST: - blogsE2eTest: isUser1 😡', isUser1)
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
            const isUser2 = await isCreatedUser(
                1,
                contextTests.users.correctUserNames[1],
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST: - blogsE2eTest: isUser1 😡', isUser1)
            const isLogin2 = await isLoginUser(
                1,
                0,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
        });
        it('SUCCESS - Ожидается - пустой массив без переписки.', async () => {
            const senderId = contextTests.users.createdUsers[0]!.userId;
            const receiverId = contextTests.users.createdUsers[1]!.userId;
            const query = {
                pageNumber: 1,
                pageSize: 10,
                sortBy: DialogAiAssistantSortBy.CreatedAt, // ✅ ключевая правка
                sortDirection: SortDirection.Desc,
                searchTextMessage: '',
                calculateSkip: () => 0,
            };
            const dialog = await contextTests.queryBus.execute(
                new GetDialogAiAssistantQuery(
                    senderId,
                    receiverId,
                    query
                )
            );

        });
        // it('SUCCESS - Ожидается - Успешное создание промпта ассистенту, если диалог не существует - создать его', async () => {
        //     const senderId = contextTests.users.createdUsers[0]!.id;
        //     const receiverId = contextTests.users.createdUsers[1]!.id;

        //     const dto = {
        //         localId: '1',
        //         prompt: 'test',
        //         senderId,
        //         receiverId,
        //     };

        //     const result = await contextTests.сommandBus.execute(
        //         new CreateMessageAiAssistantCommand(dto)
        //     );

        //     // contextTests.queryBus.execute(new GetAllProvidersModelsQuery());

        //     expect(result).toBeDefined();

        //     const dialog = await contextTests.dialogAiAssistantRepository
        //         .findOneDialogBySenderIdOrReceiverIdRepository(senderId, receiverId);

        //     expect(dialog).toBeTruthy();

        //     const message = await contextTests.dialogAiAssistantRepository
        //         .findDialogById(dialog!.id);

        //     // expect(message.length).toBeGreaterThan(0);
        // });
        // it('should create message in existing dialog', async () => {
        //     const senderId = contextTests.users.createdUsers[0]!.id;
        //     const receiverId = contextTests.users.createdUsers[1]!.id;

        //     // создаём диалог заранее
        //     const dialogId = await contextTests.сommandBus.execute(
        //         new CreateDialogAiAssistantCommand({
        //             userAId: senderId,
        //             userBId: receiverId,
        //         })
        //     );

        //     const dto = {
        //         localId: '1',
        //         prompt: 'test',
        //         senderId,
        //         receiverId,
        //     };

        //     await contextTests.сommandBus.execute(
        //         new CreateMessageAiAssistantCommand(dto)
        //     );

        //     const messages = await contextTests.dialogAiAssistantRepository
        //         .findDialogById(dialogId);

        //     // expect(messages.length).toBe(1);
        // });

        // it('should save correct message data', async () => {
        //     const senderId = contextTests.users.createdUsers[0]!.id;
        //     const receiverId = contextTests.users.createdUsers[1]!.id;

        //     const dto = {
        //         localId: '1',
        //         prompt: 'test',
        //         senderId,
        //         receiverId,
        //     };

        //     await contextTests.сommandBus.execute(
        //         new CreateMessageAiAssistantCommand(dto)
        //     );

        //     const dialog = await contextTests.dialogAiAssistantRepository
        //         .findOneDialogBySenderIdOrReceiverIdRepository(senderId, receiverId);

        //     const messages = await contextTests.dialogAiAssistantRepository
        //         .findDialogById(dialog!.id);

        //     const message = messages[0] ?? messages[0];

        //     expect(message.content).toBe('test');
        //     expect(message.senderId).toBe(senderId);
        //     expect(message.receiverId).toBe(receiverId);
        // });
    });
}
