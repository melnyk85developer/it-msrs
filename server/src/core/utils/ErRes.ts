import { ErMsgAndHttpStatusCodeArr } from "./ErrorMessagesAndHttpStatusCode";
import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { parseDBResponseError } from "./parseSequelizeError";
import { INTERNAL_STATUS_CODE } from "./utils";

export class ErRes extends HttpException {
    constructor(statusCode: number, message?: string, errorRaw?: any) {
        console.log('ErRes: - statusCode 😡', statusCode)
        let parse
        if (statusCode === -100) {
            parse = parseDBResponseError(errorRaw);
            if (parse && parse.internalCode && parse.message) {
                // statusCode = parse.internalCode;
                // message = parse.message;
            } else {
                statusCode = 404
                console.error('if -100', parse)
            }
        }
        const errorConfig = ErMsgAndHttpStatusCodeArr[statusCode];
        console.log('ErRes: - errorConfig 😡', errorConfig)

        if (statusCode === INTERNAL_STATUS_CODE.NOT_FOUND || errorConfig.statusCode === INTERNAL_STATUS_CODE.NOT_FOUND) {
            console.log('ErRes: - errorConfig - statusCode:', errorConfig.statusCode)
            throw new NotFoundException(errorConfig.messages)
        }
        if(statusCode || errorConfig.statusCode === INTERNAL_STATUS_CODE.BAD_REQUEST){
            throw new BadRequestException(errorConfig.messages)
        }

        if (errorConfig) {
            console.log('ErRes: - IF Конфигурация ошибки:', errorConfig)
            super(
                {
                    message: `${errorConfig.messages.message} ${message ? message : ''}`,
                    field: errorConfig.messages.field
                },
                errorConfig.statusCode,
            );
        } else {
            console.log('ErRes DEFAULT: - else Конфигурация ошибки:', errorConfig)
            // Если статус-код не найден, выбрасываем стандартную ошибку
            super({ message: message, field: null }, 500);
        }
    }
}