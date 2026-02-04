import { INestApplication, ValidationError, ValidationPipe } from '@nestjs/common';
import { DomainException, Extension } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';

// функция использует рекурсию для обхода объекта children при вложенных полях при валидации
// TODO: tests
export const errorFormatter = (
    errors: ValidationError[],
    errorMessage?: any,
): Extension[] => {
    const errorsForResponse = errorMessage || [];

    for (const error of errors) {
        if (!error.constraints && error.children?.length) {
            errorFormatter(error.children, errorsForResponse);
        } else if (error.constraints) {
            const constrainKeys = Object.keys(error.constraints);

            for (const key of constrainKeys) {
                // ИЗВЛЕКАЕМ ДАННЫЕ В ПЕРЕМЕННЫЕ
                const message = error.constraints[key]
                    ? `${error.constraints[key]}`
                    : '';
                const keyName = error.property;

                // !!! ИСПРАВЛЕНИЕ: СОЗДАЕМ ЭКЗЕМПЛЯР КЛАССА Extension !!!
                errorsForResponse.push(new Extension(message, keyName));
            }
        }
    }

    return errorsForResponse;
};

export function pipesSetup(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
            stopAtFirstError: true,
            exceptionFactory: (errors) => {
                const formattedErrors = errorFormatter(errors);
                // console.log('ValidationPipe: formattedErrors 😡', formattedErrors);
                throw new DomainException(
                    DomainExceptionCode.ValidationError,
                    undefined,           // 2-й аргумент: message (оставляем undefined)
                    formattedErrors      // 3-й аргумент: extensions (передаем детали ошибок)
                );
            },
        }),
    );
}