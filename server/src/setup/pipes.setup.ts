import { INestApplication, ValidationPipe } from '@nestjs/common';

export function pipesSetup(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // включает class-transformer
            whitelist: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
}