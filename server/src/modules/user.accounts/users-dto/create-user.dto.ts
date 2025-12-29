import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Role } from "../users-domain/roles-user.data";
import { Banneds } from "../users-domain/all-banneds-user.data";
// @Length(3, 50, { message: 'Email должен быть не меньше 3 и не больше 50 символов!' })
export class CreateUserDto {
    @ApiProperty({ example: 'login', description: 'Samuray - Логин пользователя!' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    @Length(3, 10, { message: 'Длина логина должена быть не меньше 2 и не больше 10 символов!' })
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

    @ApiProperty({ example: 'isBot', description: 'Является ли пользователь ботом?!' })
    @IsOptional()
    isBot?: boolean;

    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}
export class UpdateUserDto {
    // @ApiProperty({ example: '123', description: 'Уникальный идентификатор пользователя!' })
    // @IsString({ message: 'Уникальный идентификатор пользователя должно быть строкой!' })
    // id: string;
    @ApiProperty({ example: 'avatar', description: 'avatar пользователя!' })
    // @IsString({ message: 'avatar должно быть строкой!' })
    @IsOptional()
    avatar: string;
    @ApiProperty({ example: 'login', description: 'Samuray - Логин пользователя!' })
    @IsString({ message: 'login должно быть строкой!' })
    @Length(2, 30, { message: 'Длина логина должена быть не меньше 2 и не больше 30 символов!' })
    login: string;
    @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
    @IsString({ message: 'Email должен быть строкой!' })
    @IsEmail({}, { message: "Некорректный E-mail" })
    email: string;

    @ApiProperty({ example: 'name', description: 'Имя пользователя!' })
    @IsString({ message: 'name должен быть строкой!' })
    @Length(1, 16, { message: 'Пароль должен быть не меньше 6 и не больше 16 символов!' })
    @IsOptional()
    name?: string;
    @ApiProperty({ example: 'surname', description: 'Фамилия пользователя!' })
    @IsString({ message: 'surname должно быть строкой!' })
    @Length(1, 16, { message: 'Фамилия должна быть не меньше 1 и не больше 16 символов!' })
    @IsOptional()
    surname?: string;

    @ApiProperty({ example: 'gender', description: 'Гендарная пренадлежность пользователя!' })
    @IsString()
    @IsOptional()
    gender?: string;
    @ApiProperty({ example: 'liveIn', description: 'Живет в!' })
    @IsString()
    @IsOptional()
    liveIn?: string;
    @ApiProperty({ example: 'originallyFrom', description: 'Родом из!' })
    @IsString()
    @IsOptional()
    originallyFrom?: string;
    @ApiProperty({ example: 'status', description: 'Статус пользователя!' })
    @IsString()
    @IsOptional()
    status?: string;
    @ApiProperty({ example: 'imWorkingIn', description: 'Работаю в!' })
    @IsString()
    @IsOptional()
    imWorkingIn?: string;
    @ApiProperty({ example: 'lookingForAJob', description: 'Ищу ли я работу?' })
    @IsString()
    @IsOptional()
    lookingForAJob?: boolean;
    @ApiProperty({ example: 'lookingForAJobDescription', description: 'Ищу работу Описание должности!' })
    @IsString()
    @IsOptional()
    lookingForAJobDescription?: string;
    @ApiProperty({ example: 'aboutMe', description: 'Обо мне!' })
    @IsString()
    @IsOptional()
    aboutMe?: string;
    @ApiProperty({ example: 'telephone', description: 'Контактный номер телефона!' })
    @IsString()
    @IsOptional()
    telephone?: string;
    @ApiProperty({ example: 'website', description: 'Веб-сайт пользователя!' })
    @IsString()
    @IsOptional()
    website?: string;

    @ApiProperty({ example: 'isEmailConfirmed', description: 'Подтверждена ли регистрация!' })
    @IsString()
    @IsOptional()
    isEmailConfirmed?: boolean;
    @ApiProperty({ example: 'isBot', description: 'Является ли пользователь ботом?!' })
    @IsOptional()
    isBot?: boolean;
    @ApiProperty({ example: 'roles', description: 'Роли пользователя!' })
    @IsOptional()
    roles?: Role[];
    @ApiProperty({ example: 'isBanned', description: 'Заблокирован ли пользователь в данный момент?' })
    @IsOptional()
    isBanned?: boolean;
    @ApiProperty({ example: 'bannReason', description: 'Причина блокировки пользователя?' })
    @IsOptional()
    bannReason?: string;
    @ApiProperty({ example: 'bannReason', description: 'Причина блокировки пользователя?' })
    @IsOptional()
    banneds?: Banneds[];

    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'lastSeen', description: 'Время последнего посещения!' })
    lastSeen: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}