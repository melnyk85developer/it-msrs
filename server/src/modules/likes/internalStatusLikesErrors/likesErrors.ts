import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "src/core/utils/utils"

export const LIKES_ERRORS = {
    [INTERNAL_STATUS_CODE.BAD_REQUEST_INVALID_REQUEST_TO_CREATE_A_LIKE]: {
        messages: { message: 'Не корректный запрос для создания лайка!', field: 'likeStatus' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400
    }
}
export const LIKES_STATUS_POSITIVE = {
    [INTERNAL_STATUS_CODE.SUCCESS_CREATED_LIKE]: {
        messages: { message: 'Успешное создание лайка!', field: 'comment' },
        statusCode: HTTP_STATUSES.CREATED_201,
    }
}