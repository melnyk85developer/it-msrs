import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/shared/exception/httpExceptionFilter';

export function filtersSetup(app: INestApplication) {
    app.useGlobalFilters(new HttpExceptionFilter());
}
