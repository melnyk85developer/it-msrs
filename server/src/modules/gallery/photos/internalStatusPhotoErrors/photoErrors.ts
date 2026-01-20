import { HTTP_STATUSES } from "src/core/utils/utils"
import { PHOTO_INTERNAL_STATUS } from "./photoStatus"

export const PHOTO_ERRORS = {
    // PHOTO
    [PHOTO_INTERNAL_STATUS.NOT_FOUND_PHOTO]: {
        messages: { message: 'Такого фото не обнаружено!', field: 'photo' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [PHOTO_INTERNAL_STATUS.NOT_FOUND_ALBUM_NAME]: {
        messages: { message: 'Фото с таким именем не найдено!', field: 'photo' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [PHOTO_INTERNAL_STATUS.FORBIDDEN_CREATED_YOU_ARE_NOT_THE_OWNER_OF_THE_PROFILE_FOR_PHOTO]: {
        messages: { message: 'Не корректный запрос, вы не являетесь влядельцем профиля для создания фото!', field: 'photo' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [PHOTO_INTERNAL_STATUS.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_PROFILE_FOR_PHOTO]: {
        messages: { message: 'Не корректный запрос, вы не являетесь влядельцем профиля для обновления фото!', field: 'photo' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    // PHOTO
    [PHOTO_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_PHOTOID]: {
        messages: { message: 'Не корректные данные (photoId) для получения фото!', field: 'photo' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [PHOTO_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_CREATED_PHOTO]: {
        messages: { message: 'Не корректные данные для создания фото', field: 'photo' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [PHOTO_INTERNAL_STATUS.BAD_REQUEST_INCORRECT_DATA_FOR_UPDATED_PHOTO]: {
        messages: { message: 'Не корректные данные для обновления фото', field: 'photo' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [PHOTO_INTERNAL_STATUS.BAD_REQUEST_ERROR_CREATED_PHOTO]: {
        messages: { message: 'При создании фотоальбома что-то пошло не так!', field: 'photo-album' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
}
export const PHOTO_STATUS_POSITIVE = {
    [PHOTO_INTERNAL_STATUS.SUCCESS_CREATED_PHOTO]: {
        messages: { message: 'Успешное создание фото!', field: 'photo' },
        statusCode: HTTP_STATUSES.CREATED_201,
    },
    [PHOTO_INTERNAL_STATUS.SUCCESS_UPDATED_PHOTO]: {
        messages: { message: 'Успешное обновление фото!', field: 'photo' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [PHOTO_INTERNAL_STATUS.SUCCESS_DELETED_PHOTO]: {
        messages: { message: 'Успешное удаление фото!', field: 'photo' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
}