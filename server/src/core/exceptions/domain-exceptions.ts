import { ErMsgAndHttpStatusCodeArr } from 'src/core/utils/ErrorMessagesAndHttpStatusCode';
import { DomainExceptionCode } from './domain-exception-codes';

export class Extension {
    constructor(
        public message: string,
        public field: string,
    ) { }
}

export class DomainException extends Error {
    message: string;
    code: DomainExceptionCode;
    extensions: Extension[];
    field?: string;
    // !!! ДОБАВЛЯЕМ НОВОЕ ПОЛЕ !!!
    httpStatus: number;

    constructor(
        code: DomainExceptionCode,
        message?: string,
        extensions?: Extension[]
    ) {
        // 1. Ищем конфигурацию
        const errorConfig = ErMsgAndHttpStatusCodeArr[code];
        // console.log('DomainException: errorConfig.messages - 😡 ', errorConfig.messages)
        // --- Логика определения сообщений/кодов перед super() ---
        let finalMessage: string;
        let finalCode: DomainExceptionCode;
        let finalField: string | undefined;
        let finalStatus: number; // <-- ПЕРЕМЕННАЯ ДЛЯ СТАТУСА

        if (!errorConfig) {
            finalCode = DomainExceptionCode.InternalServerError;
            finalMessage = `No config for code ${code}`;
            finalStatus = 500; // Дефолтный статус
        } else {
            finalMessage = message || errorConfig.messages.message;
            finalCode = code;
            finalStatus = errorConfig.statusCode; // <-- БЕРЕМ 400 ИЗ MAP'А
            finalField = errorConfig.messages.field;
        }

        // 2. ВЫЗЫВАЕМ super()
        super(finalMessage);

        // 3. ИНИЦИАЛИЗАЦИЯ this ПОСЛЕ super()
        this.message = finalMessage;
        this.code = finalCode;
        if (extensions && extensions.length > 0) {
            this.extensions = extensions;
        } else if (finalField && finalMessage) {
            this.extensions = [new Extension(finalMessage, finalField)];
        } else {
            this.extensions = [];
        }

        this.field = finalField;

        // !!! ИНИЦИАЛИЗИРУЕМ СТАТУС, КОТОРЫЙ УЖЕ 400 !!!
        this.httpStatus = finalStatus;
    }
}