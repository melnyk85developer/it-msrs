import { HttpException } from "@nestjs/common";
import { SuccessfulResAndHttpStatusCodeArr, } from "./ErrorMessagesAndHttpStatusCode";
import { RequestContext } from "./request-context";
import * as fs from 'fs';

export const SuccessResponse = (statusCode: number, send?: any, message?: string, req?: any, res?: any) => {

    if (send && send.resFileName && send.resFilePath) {
        if (!res) {
            throw new Error('No response context available for file streaming 😡');
        }
        res.type(send.resFileName);
        res.setHeader(
            'Content-Disposition',
            `inline; filename*=UTF-8''${encodeURIComponent(send.resFileName)}`
        );

        // ВАЖНО: при стриминге файлов ничего больше не возвращаем!
        return res.sendFile(send.resFilePath);
    }

    // console.log('SuccessResponse: статус и данные перед отправкой', statusCode, send, message);
    const responseTemplate = SuccessfulResAndHttpStatusCodeArr[statusCode];

    if (send && statusCode !== 204 && responseTemplate.statusCode !== 204) {
        // console.log('SuccessResponse: send - 👍 ', send);
        return send
    }

    if (responseTemplate && responseTemplate.statusCode === 204) {
        // console.log('SuccessResponse: - IF 204 👍 ', responseTemplate.statusCode)
        throw new HttpException(responseTemplate.messages, responseTemplate.statusCode);
    }

    if (responseTemplate && statusCode !== 204) {
        // console.log('SuccessResponse: - IF: !== 204', responseTemplate.statusCode, responseTemplate);
        return send
            ? { status: responseTemplate.statusCode, ...send } // Если есть данные, разворачиваем их на верхний уровень
            : { status: responseTemplate.statusCode, message: `${responseTemplate.messages.message}${message}` }; // Если данных нет, возвращаем сообщение
    }
    if (send) {
        // console.log('SuccessResponse: - ELSE: statusCode', responseTemplate.statusCode, responseTemplate);
        return send
            ? { status: 200, ...send }
            : { status: 200, message: `${responseTemplate.messages}${message}` };
    }
};