import { ConfigModule } from "@nestjs/config";
// import * as dotenv from 'dotenv'

// dotenv.config({ quiet: true });

export const configModule = ConfigModule.forRoot({
    envFilePath: [
        // process.env.ENV_FILE_PATH?.trim(),
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        `.env.production`,
    ],
    isGlobal: true,
})