import { USERS_ERRORS, USERS_STATUS_POSITIVE } from "src/modules/user.accounts/internal-status-users-errors/users-errors";
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "./utils";
import { BLOGS_ERRORS, BLOGS_STATUS_POSITIVE } from "src/modules/bloggers-platform/blogs/internal-status-blogs-errors/blogs-errors";
import { POSTS_ERRORS, POSTS_STATUS_POSITIVE } from "src/modules/bloggers-platform/posts/internal-status-posts-errors/posts-errors";
import { COMMENTS_ERRORS, COMMENTS_STATUS_POSITIVE } from "src/modules/bloggers-platform/comments/internal-status-comments-errors/comments-errors";
import { SESSIONS_ERRORS, SESSIONS_STATUS_POSITIVE } from "src/modules/usersSessions/session-internal-status-errors/sessions-errors";
import { AUTH_ERRORS, AUTH_STATUS_POSITIVE } from "src/modules/auth/auth-internal-status-errors/authErrors";
import { CONFIRMATIONS_ERRORS, CONFIRMATIONS_STATUS_POSITIVE } from "src/modules/confirmationsCodes/confirmations-internal-status-errors/confirmationsErrors";

interface ErrorResponse {
    messages: { message: string; field: string };
    statusCode: number;
}
interface SuccessResponse {
    messages: { message: string; field?: string; sucsees?: string };
    statusCode: number;
}
export const ErMsgAndHttpStatusCodeArr: Record<number, ErrorResponse> = {
    ...AUTH_ERRORS,
    ...SESSIONS_ERRORS,
    ...USERS_ERRORS,
    ...BLOGS_ERRORS,
    ...POSTS_ERRORS,
    ...COMMENTS_ERRORS,
    ...CONFIRMATIONS_ERRORS,
    // ...LIKES_ERRORS,

    [HTTP_STATUSES.BAD_REQUEST_400]: {
        messages: { message: 'BAD_REQUEST_400', field: 'BAD_REQUEST_400' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },

    [INTERNAL_STATUS_CODE.NOT_FOUND]: {
        messages: { message: 'По Вашему запросу ничего не найдено!', field: 'auth' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST]: {
        messages: { message: 'Не валидный запрос!', field: 'auth' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_TOO_MANY_REQUESTS]: {
        messages: { message: 'Слишком много запросов!', field: 'field' },
        statusCode: HTTP_STATUSES.TOO_MANY_REQUESTS,
    },
    [INTERNAL_STATUS_CODE.FORBIDDEN]: {
        messages: { message: 'Не санкционированное действие!', field: 'field' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
}
export const SuccessfulResAndHttpStatusCodeArr: Record<number, SuccessResponse> = {
    ...AUTH_STATUS_POSITIVE,
    ...SESSIONS_STATUS_POSITIVE,
    ...USERS_STATUS_POSITIVE,
    ...BLOGS_STATUS_POSITIVE,
    ...POSTS_STATUS_POSITIVE,
    ...COMMENTS_STATUS_POSITIVE,
    ...CONFIRMATIONS_STATUS_POSITIVE,
    // ...LIKES_STATUS_POSITIVE,

    [HTTP_STATUSES.OK_200]: {
        messages: { message: 'Успех', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.OK_200,
    },
    [HTTP_STATUSES.NO_CONTENT_204]: {
        messages: { message: 'NO_CONTENT_204', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },

    [INTERNAL_STATUS_CODE.NO_CONTENT]: {
        messages: { message: 'NO_CONTENT_204', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [INTERNAL_STATUS_CODE.SUCCESS]: {
        messages: { message: 'Успех', field: 'sucsees' },
        statusCode: HTTP_STATUSES.OK_200,
    },
    [INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED]: {
        messages: { message: 'Аккаунт успешно подтверждён!', field: 'confirm' },
        statusCode: HTTP_STATUSES.OK_200,
    },
};