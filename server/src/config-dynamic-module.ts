import { ConfigModule } from "@nestjs/config";
import { join } from "path";
// import * as dotenv from 'dotenv'

// dotenv.config({ quiet: true });

export const configModule = ConfigModule.forRoot({
    envFilePath: [
        // process.env.ENV_FILE_PATH?.trim(),
        // process.env.NODE_ENV === '.env.testing' 
        
        join(__dirname, `../env`, `.env.${process.env.NODE_ENV}.local`),
        join(__dirname, `../env`, `.env.${process.env.NODE_ENV}`),
        join(__dirname, `../env`, `.env.production`),
    ],
    isGlobal: true,
})