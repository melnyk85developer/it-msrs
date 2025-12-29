import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as express from 'express';

export function corsSetup(app: INestApplication) {
    // app.use(express.json());

    app.use(cookieParser());
    app.enableCors({
        credentials: true,
        origin: true,
        exposedHeaders: ['X-Service-Message'],
    });
}