import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "../../../core/utils/utils";
import { CONFIRMATIONS_INTERNAL_STATUS } from "./confirmationsStatus";

export const CONFIRMATIONS_STATUS_POSITIVE = {
    [CONFIRMATIONS_INTERNAL_STATUS.SUCCESS_CONFIRMATION_CODE]: {
        messages: { message: ' Успешное подтверждение регистрации!', field: 'code' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
}

export const CONFIRMATIONS_ERRORS = {
    [CONFIRMATIONS_INTERNAL_STATUS.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT]: {
        messages: { message: '⛔️ Код подтверждения неверен, истек или уже был применен!', field: 'code' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [CONFIRMATIONS_INTERNAL_STATUS.BAD_REQUEST_THE_CONFIRMATION_EMAIL_ALREADY_CONFIRMED]: {
        messages: { message: '⛔️ Пользователь с таким email не найден или email уже подтверждён!', field: 'email' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [CONFIRMATIONS_INTERNAL_STATUS.BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED]: {
        messages: { message: '⛔️ Пользователь с таким email не найден или email уже подтверждён!', field: 'code' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
}