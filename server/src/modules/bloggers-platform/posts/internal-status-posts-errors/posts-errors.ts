import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "src/core/utils/utils"

export const POSTS_STATUS_POSITIVE = {
    [INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST]: {
        messages: { message: 'Успешное создание поста!', field: 'post' },
        statusCode: HTTP_STATUSES.CREATED_201,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST]: {
        messages: { message: 'Пост успешно обновлён!', field: 'post' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_DELETED_POST]: {
        messages: { message: 'Успешное удаление поста!', field: 'post' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
}

export const POSTS_ERRORS = {
    // POST
    [INTERNAL_STATUS_CODE.NOT_FOUND_POST]: {
        messages: { message: 'Такого поста не существует или он был удалён ранее!', field: 'post' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.NOT_FOUND_POST_POST_ID]: {
        messages: { message: 'Такого поста c таким postId не найденно!', field: 'postId' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.NOT_FOUND_POST_ID]: {
        messages: { message: 'Такого поста c таким id не найденно!', field: 'post' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },

    [INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_CREATED_POST]: {
        messages: { message: 'Не корректные данные для cоздания поста!', field: 'post' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_UPDATED_POST]: {
        messages: { message: 'Не корректные данные для обновления поста!', field: 'post' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_DELETED_POST]: {
        messages: { message: 'Не корректные данные для удаления поста!', field: 'post' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_POST]: {
        messages: { message: 'Не корректный запрос, вы не являетесь влядельцем поста для его удаления!', field: 'post' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [INTERNAL_STATUS_CODE.FORBIDDEN_UPDATED_YOU_ARE_NOT_THE_OWNER_OF_THE_POST]: {
        messages: { message: 'Не корректный запрос, вы не являетесь влядельцем поста для его обновления!', field: 'post' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [INTERNAL_STATUS_CODE.FORBIDDEN_THIS_ACTION_HAS_ALREADY_BEEN_PERFORMED]: {
        messages: { message: 'Это действие уже выполненно!', field: 'post' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [INTERNAL_STATUS_CODE.FORBIDDEN_YOU_CAN_ONLY_PIN_POSTS_TO_YOUR_PROFILE]: {
        messages: { message: 'Закреплять посты можно только в своём провиле!', field: 'post' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST]: {
        messages: { message: 'Поста для получения этих комментариев не обнаружено!', field: 'post' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_POST]: {
        messages: { message: 'Произошла ошибка при удалении поста!', field: 'post' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
}