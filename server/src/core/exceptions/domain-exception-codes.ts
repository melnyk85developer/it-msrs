import { HttpStatus } from "@nestjs/common";
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "src/core/utils/utils";

//если специфических кодов будет много лучше разнести их в соответствующие модули
export enum DomainExceptionCode {
    //common
    NotFound = INTERNAL_STATUS_CODE.NOT_FOUND,
    BadRequest = INTERNAL_STATUS_CODE.BAD_REQUEST,
    InternalServerError = HttpStatus.INTERNAL_SERVER_ERROR,
    Forbidden = INTERNAL_STATUS_CODE.FORBIDDEN,
    ValidationError = INTERNAL_STATUS_CODE.BAD_REQUEST,
    //auth
    Unauthorized = INTERNAL_STATUS_CODE.UNAUTHORIZED,
    EmailNotConfirmed = INTERNAL_STATUS_CODE.BAD_REQUEST,
    ConfirmationCodeExpired = INTERNAL_STATUS_CODE.BAD_REQUEST,
    PasswordRecoveryCodeExpired = INTERNAL_STATUS_CODE.BAD_REQUEST,
    //...
}