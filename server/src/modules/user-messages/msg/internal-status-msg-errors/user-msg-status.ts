export const MESSAGES_INTERNAL_STATUS = {

    SUCCESS_CREATED_MESSAGES: 1200, // Успешное создание сообщения!
    SUCCESS_UPDATED_MESSAGES: 1201, // Успешное обновление сообщения!
    SUCCESS_UPDATED_READ: 1202, // Успешное обновление статуса просмотрено!
    SUCCESS_DELETED_MESSAGES: 1203, // Успешное удаление сообщения!

    NOT_FOUND_MESSAGE: 1204, // Сообщений не обнаружено!
    NOT_FOUND_MESSAGES_FOR_UPDATE: 1205, // Сообщения не найденно для его обновления!
    NOT_FOUND_MESSAGES_FOR_DELETE: 1206, // Сообщения не обнаружено для его удаления!
    NOT_FOUND_DIALOG: 1207, // Диалога не найдено!
    NOT_FOUND_MESSAGES_FOR_UPDATE_READ: 1208, // Сообщения не найденно для обновления статуса просмотренно!

    BAD_REQUEST_CREATED_MESSAGES: 1209, // Не корректные данные для создания сообщения!
    BAD_REQUEST_UPDATED_MESSAGES: 1210, // Не корректные данные для обновления сообщения!
    ERRORS_UPDATED_MESSAGES: 1211, // Что-то пошло не так при обновлении сообщения!
    BAD_REQUEST_DELETED_MESSAGES: 1212, // Не корректные данные для удаления сообщения!
    BAD_REQUEST_DELETED_DIALOG: 1213, // Не корректные данные для удаления диалога!
    BAD_REQUEST_UPDATE_MSG_READ: 1214, // Не корректные данные для обновления статуса просмтренно в сообщении!
    BAD_REQUEST_INCORRECT_DATA_FOR_TO_GET_A_DIALOG: 1215, // Не корректные данные для получения диалога!

    FORBIDEN_UPDATE_MSG_READ: 1411, // Вы не являетесь участником беседы, для обновления статуса просмтренно в сообщении!
    FORBIDEN_TO_UPDATE_YOU_ARE_NOT_A_MEMBER_OF_THIS_MESSAGE: 1216, // Не корректный запрос, Вы не являетесь владельцем сообщения для его обновления!
    FORBIDEN_TO_DELETE_YOU_ARE_NOT_A_MEMBER_OF_THIS_DIALOG: 1217, // Не корректный запрос, Вы не являетесь участником диалога для его удаления!
    FORBIDEN_DELETION_IS_PROHIBITED_FOR_ALL_OF_YOU_WHO_ARE_NOT_THE_AUTHORS_OF_THIS_MESSAGE: 1218, // Не корректный запрос, Вы не являетесь автором этого сообщения для его удаления!

    ERROR_UPDATE_LAST_SEEN: 1218, // Ошибка обновления последней активности!
}