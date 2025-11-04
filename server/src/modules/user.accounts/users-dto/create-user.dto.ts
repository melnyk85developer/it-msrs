import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'login', description: 'Samuray - Логин пользователя!' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    @Length(2, 16, { message: 'Длина логина должена быть не меньше 2 и не больше 16 символов!' })
    readonly login: string;
    @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
    @IsString({ message: 'Email должен быть строкой!' })
    @IsNotEmpty({ message: 'Поле email не должно быть пустым!' })
    @IsEmail({}, { message: "Некорректный E-mail" })
    readonly email: string;
    @ApiProperty({ example: 'qwerty', description: 'Пароль' })
    @IsString({ message: 'Password должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле password не должно быть пустым!' })
    @Length(6, 16, { message: 'Пароль должен быть не меньше 6 и не больше 16 символов!' })
    readonly password: string;
    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}

export class UpdateUserDto {
    @ApiProperty({ example: 'login', description: 'Samuray - Логин пользователя!' })
    @IsString({ message: 'login должно быть строкой!' })
    @Length(2, 16, { message: 'Длина логина должена быть не меньше 2 и не больше 16 символов!' })
    login: string;
    @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
    @IsString({ message: 'Email должен быть строкой!' })
    @IsEmail({}, { message: "Некорректный E-mail" })
    email: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}