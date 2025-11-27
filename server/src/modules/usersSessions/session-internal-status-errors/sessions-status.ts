export const SESSIONS_INTERNAL_STATUS = {
    // SESSIONS
    SUCCESS_DELETED_SESSIONS: 766, // Удачное удаление всех сессий кроме текушей!
    SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID: 767, // Удачное удаление сессии по id устройства!
    // SESSION
    NOT_FOUND_SESSION_ID: 666, // Указаной сессии по deviceId не найдено!
    // SESSIONS
    SESSION_DELETION_ERROR: 768, // Ошибка удаления сессии

    UNAUTHORIZED_SESSION_CREATION_ERROR: 764, // Произошла ошибка при создании сессии!
    UNAUTHORIZED_SESSION_UPDATION_ERROR: 766, // Произошла ошибка при обновлении сессии!
    FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION: 774, // Не корректный запрос, вы не являетесь влядельцем сессии для её удаления!

}