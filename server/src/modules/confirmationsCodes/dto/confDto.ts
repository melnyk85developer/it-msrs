import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length,  } from "class-validator";

export class ConfDto {
    @ApiProperty({example: 'user@gmail.com', description: 'Почтовый адрес'})
    @IsString({message: 'Код подтверждения!'})
    @IsEmail( {}, {message: "Некорректный E-mail"})
    readonly confirmationCode: string;

    @ApiProperty({example: 'password-authorization-qwerty', description: 'Пароль'})
    @IsString({message: 'Пароль должен быть строкой (авторизация)!'})
    @Length(3, 16, {message: 'Вообще-то при авторизации необходимо вводить пароль!'})
    readonly expirationDate: Date;

    @ApiProperty({example: 'password-authorization-qwerty', description: 'Пароль'})
    @IsString({message: 'Пароль должен быть строкой (авторизация)!'})
    @Length(3, 16, {message: 'Вообще-то при авторизации необходимо вводить пароль!'})
    readonly isBlocked: boolean;

    @ApiProperty({example: 'password-authorization-qwerty', description: 'Пароль'})
    @IsString({message: 'Пароль должен быть строкой (авторизация)!'})
    @Length(3, 16, {message: 'Вообще-то при авторизации необходимо вводить пароль!'})
    readonly field: string;

    @ApiProperty({example: 'password-authorization-qwerty', description: 'Пароль'})
    @IsString({message: 'Пароль должен быть строкой (авторизация)!'})
    @Length(3, 16, {message: 'Вообще-то при авторизации необходимо вводить пароль!'})
    readonly userId: number;
}