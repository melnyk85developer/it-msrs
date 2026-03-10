import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from '../setup/config-validation.utility';

export enum Environments {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
    TESTING = 'testing',
}

// each module has it's own *.config.ts

@Injectable()
export class CoreConfig {
    @IsNumber({}, { message: 'Set Env variable PORT, example: 3000' })
    port!: number;

    @IsNotEmpty({
        message:
            'Set Env variable MONGO_URI, example: mongodb://localhost:27017/my-app-local-db',
    })
    mongoURI!: string;

    @IsEnum(Environments, {
        message:
            'Set correct NODE_ENV value, available values: ' +
            configValidationUtility.getEnumValues(Environments).join(', '),
    })
    env!: Environments;

    @IsBoolean({
        message:
            'Set Env variable IS_SWAGGER_ENABLED, available values: true, false',
    })
    isSwaggerEnabled!: boolean;

    @IsBoolean({
        message:
            'Set Env variable INCLUDE_TESTING_MODULE, available values: true, false, 0, 1',
    })
    includeTestingModule!: boolean;

    @IsBoolean({
        message:
            'Set Env variable SEND_INTERNAL_SERVER_ERROR_DETAILS, available values: true, false, 0, 1',
    })
    sendInternalServerErrorDetails!: boolean;

    constructor(private readonly configService: ConfigService<any, true>) {
        this.port = Number(this.configService.getOrThrow('PORT'));
        this.mongoURI = this.configService.getOrThrow('MONGO_URI');
        this.env = this.configService.getOrThrow<Environments>('NODE_ENV');

        this.isSwaggerEnabled = configValidationUtility.convertToBoolean(
            this.configService.getOrThrow('IS_SWAGGER_ENABLED'),
        ) as boolean;

        this.includeTestingModule = configValidationUtility.convertToBoolean(
            this.configService.getOrThrow('INCLUDE_TESTING_MODULE'),
        ) as boolean;

        this.sendInternalServerErrorDetails =
            configValidationUtility.convertToBoolean(
                this.configService.getOrThrow(
                    'SEND_INTERNAL_SERVER_ERROR_DETAILS',
                ),
            ) as boolean;

        configValidationUtility.validateConfig(this);
    }
}