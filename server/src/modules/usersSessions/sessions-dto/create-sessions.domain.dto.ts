import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { User } from "src/modules/user.accounts/users-domain/user.entity";

export class CreateSessionDto {
    @ApiProperty({ example: '192.168.1.1', description: 'IP адрес пользователя' })
    // @IsString({ message: 'ip должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    ip: string | null;
    @ApiProperty({ example: 'Chrome or FireFox', description: 'Название браузера' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    browserName: string | null;
    @ApiProperty({ example: '134.0.0.0', description: 'Версия устройства' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    browserVersion: string | null;
    @ApiProperty({ example: 'Linux or Windows', description: 'Название Операционной системы' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    osName: string | null;
    @ApiProperty({ example: 'Linux Ubuntu or Windows10', description: 'Версия Операционной сстемы' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    osVersion: string | null;
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    device: string | null;
    @ApiProperty({ example: 'Ukraine', description: 'Страна' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    country: string | null;
    @ApiProperty({ example: 'Kiev', description: 'Город' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    city: string | null;
    @ApiProperty({ example: '123', description: 'Уникальный идентификатор пользователя' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    userId: string;
    @ApiProperty({ example: 'device123', description: 'Уникальный идентификатор устройства' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    deviceId: string;
    @ApiProperty({ example: '2025-04-07T12:34:56Z', description: 'Дата создания сессии' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    lastActiveDate: number;
    @ApiProperty({ example: '2025-04-08T12:34:56Z', description: 'Дата окончания сессии' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    expirationDate: number;
}
export class CreateSessionDomainDto {
    @ApiProperty({ example: '192.168.1.1', description: 'IP адрес пользователя' })
    // @IsString({ message: 'ip должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    ip: string | null;
    @ApiProperty({ example: 'Chrome or FireFox', description: 'Название браузера' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    browserName: string | null;
    @ApiProperty({ example: '134.0.0.0', description: 'Версия устройства' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    browserVersion: string | null;
    @ApiProperty({ example: 'Linux or Windows', description: 'Название Операционной системы' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    osName: string | null;
    @ApiProperty({ example: 'Linux Ubuntu or Windows10', description: 'Версия Операционной сстемы' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    osVersion: string | null;
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    device: string | null;
    @ApiProperty({ example: 'Ukraine', description: 'Страна' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    country: string | null;
    @ApiProperty({ example: 'Kiev', description: 'Город' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    city: string | null;
    @ApiProperty({ example: '123', description: 'Уникальный идентификатор пользователя' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    userId: string;
    @ApiProperty({ example: 'device123', description: 'Уникальный идентификатор устройства' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    deviceId: string;
    @ApiProperty({ example: '2025-04-07T12:34:56Z', description: 'Дата создания сессии' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    lastActiveDate: number;
    @ApiProperty({ example: '2025-04-08T12:34:56Z', description: 'Дата окончания сессии' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    expirationDate: number;
    @IsBoolean()
    @IsOptional()
    readonly remember: boolean;
}
export class UpdateSessionDto {
    @ApiProperty({ example: '192.168.1.1', description: 'IP адрес пользователя' })
    // @IsString({ message: 'ip должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    ip: string | null;
    @ApiProperty({ example: 'Chrome or FireFox', description: 'Название браузера' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    browserName: string | null;
    @ApiProperty({ example: '134.0.0.0', description: 'Версия устройства' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    browserVersion: string | null;
    @ApiProperty({ example: 'Linux or Windows', description: 'Название Операционной системы' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    osName: string | null;
    @ApiProperty({ example: 'Linux Ubuntu or Windows10', description: 'Версия Операционной сстемы' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    osVersion: string | null;
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    device: string | null;
    @ApiProperty({ example: 'Ukraine', description: 'Страна' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    country: string | null;
    @ApiProperty({ example: 'Kiev', description: 'Город' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    city: string | null;
    @ApiProperty({ example: '123', description: 'Уникальный идентификатор пользователя' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    userId: string;
    @ApiProperty({ example: 'device123', description: 'Уникальный идентификатор устройства' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    deviceId: string;
    @ApiProperty({ example: '2025-04-07T12:34:56Z', description: 'Дата создания сессии' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    lastActiveDate: number;
    @ApiProperty({ example: '2025-04-08T12:34:56Z', description: 'Дата окончания сессии' })
    // @IsString({ message: 'name должно быть строкой!' })
    // @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    expirationDate: number;
    @IsBoolean()
    @IsOptional()
    readonly remember: boolean;
}