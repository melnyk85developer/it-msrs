import { ConfigModule } from "@nestjs/config";
import { join } from "path";
import * as path from 'path';
// import * as dotenv from 'dotenv'
// dotenv.config({ quiet: true })

const rootDir = process.cwd();

// Настраиваем пути с учетом того, что env перенесен в src/env
// В dist это будет работать, если при сборке папка env копируется в корень dist
const envPath = path.join(rootDir, 'src', 'env');

export const configModule = ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [
        path.join(envPath, `.env.${process.env.NODE_ENV || 'development'}.local`),
        path.join(envPath, `.env.${process.env.NODE_ENV || 'development'}`),
        path.join(envPath, `.env.production`),
    ],
    // Добавляем проверку, чтобы видеть, откуда он пытается читать
    expandVariables: true,
});
