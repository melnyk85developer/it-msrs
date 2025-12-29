import { HTTP_STATUSES } from "src/core/utils/utils"
import { SESSIONS_INTERNAL_STATUS } from "./sessions-status"

export const SESSIONS_ERRORS = {
    // SESSION 
    [SESSIONS_INTERNAL_STATUS.NOT_FOUND_SESSION_ID]: {
        messages: { message: '🧐 Указаной сессии по deviceId не найдено!', field: 'session' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [SESSIONS_INTERNAL_STATUS.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION]: {
        messages: { message: 'Не корректный запрос, вы не являетесь влядельцем сессии для её удаления!', field: 'session' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [SESSIONS_INTERNAL_STATUS.SESSION_DELETION_ERROR]: {
        messages: { message: 'Ошибка удаления сессии!', field: 'session' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
}
export const SESSIONS_STATUS_POSITIVE = {
    // SESSIONS
    [SESSIONS_INTERNAL_STATUS.SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID]: {
        messages: { message: 'Успешное удаление сессии!', field: 'sessions' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [SESSIONS_INTERNAL_STATUS.SUCCESS_DELETED_SESSIONS]: {
        messages: { message: 'Удачное удаление всех сессий кроме текушей!', field: 'sessions' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
}