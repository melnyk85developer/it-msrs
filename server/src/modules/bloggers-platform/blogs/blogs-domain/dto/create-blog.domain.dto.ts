import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
import { Types } from "mongoose";

export class CreateBlogDomainDto {
    @ApiProperty({ example: 'name', description: 'SamurayBlog!' })
    @IsString({ message: 'name должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    readonly name: string;
    @ApiProperty({ example: 'description', description: 'Описание Блога!' })
    @IsString({ message: 'description должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле description не должно быть пустым!' })
    @Length(1, 500, { message: 'Длина description должена быть не меньше 1 и не больше 500 символов!' })
    readonly description: string;
    @ApiProperty({ example: 'websiteUrl', description: 'Адрес сайта URL!' })
    @IsString({ message: 'websiteUrl должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле websiteUrl не должно быть пустым!' })
    @Length(1, 150, { message: 'Длина websiteUrl должена быть не меньше 1 и не больше 150 символов!' })
    @IsUrl()
    readonly websiteUrl: string;
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    // @IsString({ message: 'userId должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    // @Length(1, 60, { message: 'Длина userId должена быть не меньше 1 и не больше 60 символов!' })
    userId: string;
    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}