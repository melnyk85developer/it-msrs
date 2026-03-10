import { pipesSetup } from './pipes.setup';
import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { corsSetup } from './cors.setup';
import { filtersSetup } from './filters.setup';


export function appSetup(app: INestApplication, isSwaggerEnabled: boolean) {
    pipesSetup(app);
    filtersSetup(app);
    // globalPrefixSetup(app);
    swaggerSetup(app, isSwaggerEnabled);
    corsSetup(app);
}