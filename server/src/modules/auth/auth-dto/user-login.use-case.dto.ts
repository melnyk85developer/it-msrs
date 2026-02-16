import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, Length, } from "class-validator";
import { Trim } from "src/core/decorators/transform/trim";

export class UserLoginUseCaseDto {
    @ApiProperty({ example: 'ip', description: 'ip адрес пользователя!' })
    @IsString({ message: 'ip Должно быть строкой!' })
    readonly ip: string;

    @ApiProperty({ example: 'userAgent', description: 'Информация об устройстве пользователя!' })
    @IsString({ message: 'userAgent должен быть строкой!' })
    readonly userAgent: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя!' })
    @IsString({ message: 'userId должен быть строкой!' })
    readonly userId: string;

    @ApiProperty({ example: 'refreshToken', description: 'Уникальный идентификатор пользователя!' })
    @IsString({ message: 'refreshToken должен быть строкой!' })
    readonly refreshToken: string;

    @IsBoolean()
    @IsOptional()
    readonly remember: boolean;
}
// @Length(3, 50, { message: 'Email должен быть не меньше 3 и не больше 50 символов!' })