import { HTTP_STATUSES } from "src/core/utils/utils"
import { MESSAGES_INTERNAL_STATUS } from "./user-msg-status"

export const MESSAGES_STATUS_POSITIVE = {
    [MESSAGES_INTERNAL_STATUS.SUCCESS_CREATED_MESSAGES]: {
        messages: { message: '🙂 Успешное создание сообщения!', field: 'NO_FILED' },
        statusCode: HTTP_STATUSES.CREATED_201,
    },
    [MESSAGES_INTERNAL_STATUS.SUCCESS_UPDATED_MESSAGES]: {
        messages: { message: '🙂 Успешное обновление сообщения!', field: 'NO_FILED' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [MESSAGES_INTERNAL_STATUS.SUCCESS_UPDATED_READ]: {
        messages: { message: '🙂 Успешное обновление статуса просмотрено!', field: 'NO_FILED' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [MESSAGES_INTERNAL_STATUS.SUCCESS_DELETED_MESSAGES]: {
        messages: { message: '🙂 Успешное удаление сообщения!', field: 'NO_FILED' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },

}
export const MESSAGES_ERRORS = {
    [MESSAGES_INTERNAL_STATUS.NOT_FOUND_MESSAGE]: {
        messages: { message: '😉 Сообщений не обнаружено!', field: 'messages' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [MESSAGES_INTERNAL_STATUS.NOT_FOUND_MESSAGES_FOR_UPDATE]: {
        messages: { message: '😉 Сообщения не найденно для его обновления!', field: 'messages' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [MESSAGES_INTERNAL_STATUS.NOT_FOUND_MESSAGES_FOR_DELETE]: {
        messages: { message: '😉 Сообщения не обнаружено для его удаления!', field: 'messages' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },

    [MESSAGES_INTERNAL_STATUS.NOT_FOUND_DIALOG]: {
        messages: { message: '😉 Диалога не найдено!', field: 'messages' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [MESSAGES_INTERNAL_STATUS.NOT_FOUND_MESSAGES_FOR_UPDATE_READ]: {
        messages: { message: '😉 Сообщения не найденно для обновления статуса просмотренно!', field: 'messages' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },


    [MESSAGES_INTERNAL_STATUS.BAD_REQUEST_CREATED_MESSAGES]: {
        messages: { message: '😡 Не корректные данные для создания сообщения!', field: 'messages' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [MESSAGES_INTERNAL_STATUS.BAD_REQUEST_UPDATED_MESSAGES]: {
        messages: { message: '😡 Не корректные данные для обновления сообщения!', field: 'messages' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [MESSAGES_INTERNAL_STATUS.ERRORS_UPDATED_MESSAGES]: {
        messages: { message: '😡 Что-то пошло не так при обновлении сообщения!', field: 'messages' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [MESSAGES_INTERNAL_STATUS.BAD_REQUEST_DELETED_MESSAGES]: {
        messages: { message: '😡 Не корректные данные для удаления сообщения!', field: 'messages' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [MESSAGES_INTERNAL_STATUS.BAD_REQUEST_DELETED_DIALOG]: {
        messages: { message: '😡 Не корректные данные для удаления диалога!', field: 'messages' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [MESSAGES_INTERNAL_STATUS.BAD_REQUEST_UPDATE_MSG_READ]: {
        messages: { message: '😡 Не корректные данные для обновления статуса просмтренно в сообщении!', field: 'messages' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [MESSAGES_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_TO_GET_A_DIALOG]: {
        messages: { message: '😡 Не корректные данные для получения диалога!', field: 'messages' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [MESSAGES_INTERNAL_STATUS.FORBIDEN_UPDATE_MSG_READ]: {
        messages: { message: '😡 Вы не являетесь участником беседы, для обновления статуса просмтренно в сообщении!', field: 'messages' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [MESSAGES_INTERNAL_STATUS.FORBIDEN_TO_UPDATE_YOU_ARE_NOT_A_MEMBER_OF_THIS_MESSAGE]: {
        messages: { message: '😡 Не корректный запрос, Вы не являетесь владельцем сообщения для его обновления!', field: 'messages' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [MESSAGES_INTERNAL_STATUS.FORBIDEN_TO_DELETE_YOU_ARE_NOT_A_MEMBER_OF_THIS_DIALOG]: {
        messages: { message: '😡 Не корректный запрос, Вы не являетесь участником диалога для его удаления!', field: 'messages' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [MESSAGES_INTERNAL_STATUS.FORBIDEN_DELETION_IS_PROHIBITED_FOR_ALL_OF_YOU_WHO_ARE_NOT_THE_AUTHORS_OF_THIS_MESSAGE]: {
        messages: { message: '😡 Не корректный запрос, Вы не являетесь автором этого сообщения для его удаления!', field: 'messages' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [MESSAGES_INTERNAL_STATUS.ERROR_UPDATE_LAST_SEEN]: {
        messages: { message: '😡 Не корректный userId', field: 'user' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
}