export const userMsgMapForRender = (message, userId: string) => {
    return {
        msgId: message.msgId,
        message: message.message,
        senderId: message.senderId,
        receiverId: message.receiverId,
        read: message.read,
        conversationId: message.conversationId,
        replyToMessageId: message.replyToMessageId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        meta: message.meta
    }
}
// export const arrUsersMsgMapForRender = (messages: any, userId: string) => {
//     const newMessages = [];
//     for (let i = 0; i < messages.length; i++) {
//         let message = userMsgMapForRender(messages[i], userId);
//         newMessages.push(message);
//     }
//     return newMessages;
// }