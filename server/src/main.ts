import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    appSetup(app);
    const PORT = process.env.PORT || 5005;
    await app.listen(PORT, () => {
        console.log('Server стартанул на порту 😎 ' + PORT);
    });
}
bootstrap();