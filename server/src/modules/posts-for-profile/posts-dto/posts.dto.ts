import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { AuthorPost } from "../posts-domain/author-post-shema";

export class CreatePostForProfileDomainDto {
    @ApiProperty({ example: 'Контент', description: 'Текст поста' })
    @IsString({ message: 'refreshToken должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле refreshToken не должно быть пустым!' })
    @Length(1, 500, { message: 'Длина name должена быть не меньше 1 и не больше 50 символов!' })
    title: string;
    @ApiProperty({ example: 'content', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле content не должно быть пустым!' })
    @Length(1, 8000, { message: 'Длина content должена быть не меньше 1 и не больше 8000 символов!' })
    content: string;
    @ApiProperty({ example: 'image', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsOptional()
    image: string | null;
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    @Length(1, 60, { message: 'Длина userId должена быть не меньше 1 и не больше 60 символов!' })
    userId: string;
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'profileId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле profileId не должно быть пустым!' })
    profileId: string;
    @ApiProperty({ example: 'image', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsObject()
    authorPost: AuthorPost;
    @ApiProperty({ example: 'pin', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsNotEmpty({ message: 'Поле pin не должно быть пустым!' })
    @IsBoolean({ message: 'pin должно быть boolean!' })
    pin: boolean;
    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}