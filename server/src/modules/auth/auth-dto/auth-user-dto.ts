import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, Length, } from "class-validator";
import { Trim } from "src/core/decorators/transform/trim";

export class AuthUserDto {
    @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
    @IsString({ message: 'loginOrEmail Должно быть строкой (авторизация)!' })
    readonly loginOrEmail: string;

    @ApiProperty({ example: 'password-authorization-qwerty', description: 'Пароль' })
    @IsString({ message: 'Пароль должен быть строкой (авторизация)!' })
    readonly password: string;

    @IsBoolean()
    @IsOptional()
    readonly remember: boolean;
}
// @Length(3, 50, { message: 'Email должен быть не меньше 3 и не больше 50 символов!' })