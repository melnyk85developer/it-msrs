import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Multer } from 'multer';
import { Trim } from "src/core/decorators/transform/trim";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateUserInputDto {
    @ApiProperty({ example: 'login', description: 'Samuray - Логин пользователя!' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    @Length(3, 10, { message: 'Длина логина должена быть не меньше 3 и не больше 20 символов!' })
    readonly login: string;
    @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
    @IsString({ message: 'Email должен быть строкой!' })
    @IsNotEmpty({ message: 'Поле email не должно быть пустым!' })
    @IsEmail({}, { message: "Некорректный E-mail" })
    @Length(3, 50, { message: 'Длина E-mail должена быть не меньше 3 и не больше 50 символов!' })
    readonly email: string;
    @ApiProperty({ example: 'qwerty', description: 'Пароль' })
    @IsString({ message: 'Password должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле password не должно быть пустым!' })
    @Length(6, 20, { message: 'Пароль должен быть не меньше 6 и не больше 20 символов!' })
    readonly password: string;

    @ApiProperty({ example: 'isBot', description: 'Является ли пользователь ботом?!' })
    @IsOptional()
    readonly isBot?: boolean;

    @ApiProperty({ example: 'name', description: 'Имя пользователя!' })
    @IsString({ message: 'name должен быть строкой!' })
    @Length(1, 16, { message: 'Пароль должен быть не меньше 6 и не больше 16 символов!' })
    @IsOptional()
    readonly name?: string;
    @ApiProperty({ example: 'surname', description: 'Фамилия пользователя!' })
    @IsString({ message: 'surname должно быть строкой!' })
    @Length(1, 16, { message: 'Фамилия должна быть не меньше 1 и не больше 16 символов!' })
    @IsOptional()
    readonly surname?: string;
}