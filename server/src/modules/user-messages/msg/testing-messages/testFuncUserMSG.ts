import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";


export const isCreatedMsg1 = async (msg: any, access: string, refresh: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdMessage1) {
        const { createdMessage, response } = await contextTests.userMessagesTestManager.createMessage(
            access,
            refresh,
            msg,
            contextTests.constants.userAgent[10],
            statusCode
        )
        // console.log('TEST - isCreatedUser', isCreatedUser)
        if (response.status === HTTP_STATUSES.CREATED_201) {
            expect(createdMessage.message).toEqual(msg.message);
            expect(createdMessage.senderId).toEqual(msg.senderId);
            expect(createdMessage.receiverId).toEqual(msg.receiverId);
            expect(createdMessage.read).toEqual(msg.read);
            expect(createdMessage.replyToMessageId).toEqual(msg.replyToMessageId);
            contextTests.createdMessage1 = createdMessage
            return contextTests.createdMessage1
        } else {
            return response
        }
    }
}
export const isCreatedMsg2 = async (msg: any, access: string, refresh: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdMessage2) {
        const { createdMessage, response } = await contextTests.userMessagesTestManager.createMessage(
            access,
            refresh,
            msg,
            contextTests.constants.userAgent[10],
            statusCode
        )
        // console.log('TEST - isCreatedUser', isCreatedUser)
        if (response.status === HTTP_STATUSES.CREATED_201) {
            expect(createdMessage.message).toEqual(msg.message);
            expect(createdMessage.senderId).toEqual(msg.senderId);
            expect(createdMessage.receiverId).toEqual(msg.receiverId);
            expect(createdMessage.read).toEqual(msg.read);
            expect(createdMessage.replyToMessageId).toEqual(msg.replyToMessageId);
            contextTests.createdMessage2 = createdMessage
            return contextTests.createdMessage2
        } else {
            return response
        }
    }
}
export const isCreatedMsg3 = async (msg: any, access: string, refresh: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdMessage3) {
        const { createdMessage, response } = await contextTests.userMessagesTestManager.createMessage(
            access,
            refresh,
            msg,
            contextTests.constants.userAgent[10],
            statusCode
        )
        // console.log('TEST - isCreatedUser', isCreatedUser)
        if (response.status === HTTP_STATUSES.CREATED_201) {
            expect(createdMessage.message).toEqual(msg.message);
            expect(createdMessage.senderId).toEqual(msg.senderId);
            expect(createdMessage.receiverId).toEqual(msg.receiverId);
            expect(createdMessage.read).toEqual(msg.read);
            expect(createdMessage.replyToMessageId).toEqual(msg.replyToMessageId);
            // expect(createdMessage.createdAt).toEqual(msg.createdAt);
            // expect(createdMessage.attachments).toEqual(msg.attachments);
            contextTests.createdMessage3 = createdMessage
            return contextTests.createdMessage3
        } else {
            return response
        }
    }
}