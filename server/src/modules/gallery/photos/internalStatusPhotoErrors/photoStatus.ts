export const PHOTO_INTERNAL_STATUS = {
    // PHOTO
    SUCCESS_CREATED_PHOTO: 994, // Успешное создание фото!
    SUCCESS_UPDATED_PHOTO: 993, // Успешное обновление фото!
    SUCCESS_DELETED_PHOTO: 992, // Успешное удаление фото!

    // PHOTO
    NOT_FOUND_PHOTO: 990, // Такого фото не обнаружено!
    NOT_FOUND_ALBUM_NAME: 984, // Фото с таким именем не найдено!

    // PHOTO
    BAD_REQUEST_INCORRECT_DATA_PHOTOID: 991, // Не корректные данные для получения фото photoId
    BAD_REQUEST_INCORRECT_DATA_FOR_CREATED_PHOTO: 989, // Не корректные данные для создания фото
    BAD_REQUEST_INCORRECT_DATA_FOR_UPDATED_PHOTO: 988, // Не корректные данные для обновления фото
    BAD_REQUEST_INCORRECT_DATA_FOR_DELETED_PHOTO: 987, // Не корректные данные для удаления фото
    BAD_REQUEST_ERROR_CREATED_PHOTO: 983, // При создании фотоальбома что-то пошло не так!

    FORBIDDEN_CREATED_YOU_ARE_NOT_THE_OWNER_OF_THE_PROFILE_FOR_PHOTO: 986, // Не корректный запрос, вы не являетесь влядельцем профиля для создания фото!
    FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_PROFILE_FOR_PHOTO: 985, // Не корректный запрос, вы не являетесь влядельцем профиля для обновления фото!

}