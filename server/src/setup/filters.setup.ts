import { INestApplication } from '@nestjs/common';
import { AllHttpExceptionsFilter } from 'src/core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from 'src/core/exceptions/filters/domain-exceptions.filter';

export function filtersSetup(app: INestApplication) {
    app.useGlobalFilters(
        new AllHttpExceptionsFilter(),
        new DomainHttpExceptionsFilter(),
    );
}
