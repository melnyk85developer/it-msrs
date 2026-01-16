
export const POSTS_INTERNAL_STATUS = {
    SUCCESS_CREATED_POST: 1980, // Успешное создание поста!
    SUCCESS_UPDATED_POST: 981, // Успешное удаление поста!
    SUCCESS_DELETED_POST: 982, // Успешное создание поста!

    BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST: 2937, // Блога для создания этого поста не обнаруженно"
    BAD_REQUEST_UPDATED_POST: 2938, // Произошла ошибка при обновлении поста!
    BAD_REQUEST_ERROR_DELETED_POST: 2939, // Произошла ошибка при удалении поста!

    // POST
    NOT_FOUND_POST: 1981, // Такого поста не существует или он был удалён ранее!
    NOT_FOUND_POST_POST_ID: 642, // Такого поста не обнаружено!
    NOT_FOUND_POST_ID: 644, // Такого поста не обнаружено!
    // POST
    BAD_REQUEST_INCORRECT_DATA_FOR_CREATED_POST: 1979, // Не корректные данные для cоздания поста!
    BAD_REQUEST_INCORRECT_DATA_FOR_UPDATED_POST: 1978, // Не корректные данные для обновления поста!
    BAD_REQUEST_INCORRECT_DATA_FOR_DELETED_POST: 1977, // Не корректные данные для удаления поста!
    FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_POST: 1980, // Не корректный запрос, вы не являетесь влядельцем поста для его удаления!
    FORBIDDEN_UPDATED_YOU_ARE_NOT_THE_OWNER_OF_THE_POST: 1976, // Не корректный запрос, вы не являетесь влядельцем поста для его обновления!
    FORBIDDEN_THIS_ACTION_HAS_ALREADY_BEEN_PERFORMED: 1975, // Это действие уже выполненно!
    FORBIDDEN_YOU_CAN_ONLY_PIN_POSTS_TO_YOUR_PROFILE: 1974, // Закреплять посты можно только в своём провиле!
}