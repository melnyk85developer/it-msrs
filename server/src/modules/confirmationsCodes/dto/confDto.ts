import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, Length, } from "class-validator";

export class ConfDto {
    @ApiProperty({ example: 'confirmationCode', description: 'Код подтверждения!' })
    @IsString({ message: 'Код подтверждения!' })
    confirmationCode: string;
    
    @ApiProperty({ example: 'isBlocked', description: 'Включена ли блокировка.' })
    @IsBoolean({ message: 'Блокировка!' })
    isBlocked: boolean;

    @ApiProperty({ example: 'isCooldown', description: 'Время восстановления' })
    @IsBoolean({ message: 'Блокировка!' })
    isCooldown: boolean;

    @ApiProperty({ example: 'add', description: 'Время отсчета до окончания блокировки!' })
    @IsString({ message: 'Блокировка!' })
    add: string;

    @ApiProperty({ example: 'password-authorization-qwerty', description: 'Пароль' })
    @IsString({ message: 'Пароль должен быть строкой (авторизация)!' })
    @Length(3, 16, { message: 'Вообще-то при авторизации необходимо вводить пароль!' })
    minutes: number;

    @ApiProperty({ example: 'password-authorization-qwerty', description: 'Пароль' })
    @IsString({ message: 'Пароль должен быть строкой (авторизация)!' })
    @Length(3, 16, { message: 'Вообще-то при авторизации необходимо вводить пароль!' })
    field: string;

    @ApiProperty({ example: 'userId', description: 'Пароль' })
    @IsString()
    userId: string;
}
export class UodateConfDto {
    @ApiProperty({ example: 'id', description: 'Уникальный идентификатор подтверждения!' })
    @IsString({ message: 'id подтверждения!' })
    readonly id: string;

    @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
    @IsString({ message: 'Код подтверждения!' })
    readonly confirmationCode: string;

    @ApiProperty({ example: 'add', description: 'Время отсчёта!' })
    @IsString({ message: 'Date' })
    readonly add: string

    @ApiProperty({ example: 'password-authorization-qwerty', description: 'Пароль' })
    readonly minutes: number;

    @ApiProperty({ example: 'password-authorization-qwerty', description: 'Пароль' })
    isBlocked: boolean;

    @ApiProperty({ example: 'isCooldown', description: 'Время восстановления' })
    isCooldown: boolean;

    @ApiProperty({ example: 'password-authorization-qwerty', description: 'Пароль' })
    @IsString({ message: 'field - Это название сущьности с которой работает подтверждение кода!' })
    readonly field: string;

    @ApiProperty({ example: 'password-authorization-qwerty', description: 'Пароль' })
    @IsString()
    readonly userId: string;
}