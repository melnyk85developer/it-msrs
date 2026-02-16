import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, Length, } from "class-validator";
import { Trim } from "src/core/decorators/transform/trim";
import { type RefreshTokenPayloadType } from "./refresh-token-payload.dto";

export class UserRefreshTokenUseCaseDto {
    @ApiProperty({ example: 'ip', description: 'ip адрес пользователя!' })
    @IsString({ message: 'ip Должно быть строкой!' })
    readonly ip: string;

    @ApiProperty({ example: 'userAgent', description: 'Информация об устройстве пользователя!' })
    @IsString({ message: 'userAgent должен быть строкой!' })
    readonly userAgent: string;

    @ApiProperty({ example: 'refreshToken', description: 'Уникальный идентификатор пользователя!' })
    @IsString({ message: 'refreshToken должен быть строкой!' })
    readonly refreshToken: string;

    @ApiProperty({ example: 'refreshTokenPayload', description: 'Уникальный идентификатор пользователя!' })
    @IsString({ message: 'refreshTokenPayload должен быть строкой!' })
    readonly refreshTokenPayload: RefreshTokenPayloadType;
}
// @Length(3, 50, { message: 'Email должен быть не меньше 3 и не больше 50 символов!' })