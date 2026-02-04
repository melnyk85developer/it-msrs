import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdateSessionInputDto {
    @ApiProperty({ example: '192.168.1.1', description: 'IP адрес пользователя' })
    @IsString({ message: 'ip должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    ip: string;
    @ApiProperty({ example: 'Chrome or FireFox', description: 'Название браузера' })
    @IsString({ message: 'name должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    browserName: string;
    @ApiProperty({ example: '134.0.0.0', description: 'Версия устройства' })
    @IsString({ message: 'name должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    browserVersion: string;
    @ApiProperty({ example: 'Linux or Windows', description: 'Название Операционной системы' })
    @IsString({ message: 'name должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    osName: string;
    @ApiProperty({ example: 'Linux Ubuntu or Windows10', description: 'Версия Операционной сстемы' })
    @IsString({ message: 'name должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    osVersion: string;
    @ApiProperty({ example: 'Ukraine', description: 'Страна' })
    @IsString({ message: 'name должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    country: string;
    @ApiProperty({ example: 'Kiev', description: 'Город' })
    @IsString({ message: 'name должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    city: string;
    @ApiProperty({ example: '123', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'name должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    userId: string;
    @ApiProperty({ example: 'device123', description: 'Уникальный идентификатор устройства' })
    @IsString({ message: 'name должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    deviceId: string;
    @ApiProperty({ example: '2025-04-07T12:34:56Z', description: 'Дата создания сессии' })
    @IsString({ message: 'name должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    lastActiveDate: number;
    @ApiProperty({ example: '2025-04-08T12:34:56Z', description: 'Дата окончания сессии' })
    @IsString({ message: 'name должно быть строкой!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    expirationDate: number;
}