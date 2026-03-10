import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CoreConfig } from './core/core.config';
import { initAppModule } from './init-app-module';

async function bootstrap() {
    const DynamicAppModule = await initAppModule();
    // создаём на основе донастроенного модуля наше приложение
    const app = await NestFactory.create(DynamicAppModule);

    const coreConfig = app.get<CoreConfig>(CoreConfig);

    appSetup(app, coreConfig.isSwaggerEnabled); //глобальные настройки приложения

    const port = coreConfig.port;

    await app.listen(port, () => {
        console.log('App starting listen port: ', port);
        console.log('NODE_ENV: ', coreConfig.env);
    });
}
bootstrap();

// const bootstrap = async () => {
//     const app = await NestFactory.create<NestExpressApplication>(AppModule);
//     app.set('trust proxy', true);
//     appSetup(app);
//     const PORT = process.env.PORT || 5005;
//     await app.listen(PORT, () => {
//         console.log('Server стартанул на порту 😎 ' + PORT);
//     });
// }
// bootstrap();