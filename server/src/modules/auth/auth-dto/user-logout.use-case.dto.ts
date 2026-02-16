import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { type RefreshTokenPayloadType } from "./refresh-token-payload.dto";

export class UserLogoutUseCaseDto {
    @ApiProperty({ example: 'refreshToken', description: 'Уникальный идентификатор пользователя!' })
    @IsString({ message: 'refreshToken должен быть строкой!' })
    readonly refreshToken: string;

    @ApiProperty({ example: 'refreshTokenPayload', description: 'Уникальный идентификатор пользователя!' })
    @IsString({ message: 'refreshTokenPayload должен быть строкой!' })
    readonly refreshTokenPayload: RefreshTokenPayloadType;
}