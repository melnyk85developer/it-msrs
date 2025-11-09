import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Types } from "mongoose";

export class CreatePostDto {
    @ApiProperty({ example: 'title', description: 'Заголовок поста!' })
    @IsString({ message: 'title должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле title не должно быть пустым!' })
    @Length(3, 50, { message: 'Поле title должно быть не менее 3 и не более 60 символов!' })
    readonly title: string;
    @ApiProperty({ example: 'shortDescription', description: 'Краткое описание!' })
    @IsString({ message: 'shortDescription должно быть строкой!' })
    @IsNotEmpty({ message: 'shortDescription должно быть обязательно!' })
    @Length(3, 500, { message: 'shortDescription должно быть не менее 3 и не более 500 символов!!' })
    readonly shortDescription: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста поста!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле content не должно быть пустым!' })
    @Length(3, 8000, { message: 'Поле content должно быть не менее 3 и не более 8000 символов!' })
    readonly content: string;
    @IsNotEmpty({ message: 'Поле blogId не должно быть пустым!' })
    @IsString({ message: 'blogId должно быть строкой!' })
    blogId: string;

    // @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    // createdAt: string;
    // @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    // updatedAt: string;
    // @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    // deletedAt: string | null;
}
export class CreatePostForBlogDto {
    @ApiProperty({ example: 'title', description: 'Заголовок поста!' })
    @IsString({ message: 'title должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле title не должно быть пустым!' })
    @Length(3, 50, { message: 'Поле title должно быть не менее 3 и не более 60 символов!' })
    readonly title: string;
    @ApiProperty({ example: 'shortDescription', description: 'Краткое описание!' })
    @IsString({ message: 'shortDescription должно быть строкой!' })
    @IsNotEmpty({ message: 'shortDescription должно быть обязательно!' })
    @Length(3, 500, { message: 'shortDescription должно быть не менее 3 и не более 500 символов!!' })
    readonly shortDescription: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста поста!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле content не должно быть пустым!' })
    @Length(3, 8000, { message: 'Поле content должно быть не менее 3 и не более 8000 символов!' })
    readonly content: string;

    // @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    // createdAt: string;
    // @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    // updatedAt: string;
    // @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    // deletedAt: string | null;
}

export class UpdatePostDto {
    @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого поста!' })
    id: string;
    @ApiProperty({ example: 'title', description: 'Заголовок поста!' })
    @IsString({ message: 'title должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле title не должно быть пустым!' })
    title: string;
    @ApiProperty({ example: 'shortDescription', description: 'Краткое описание!' })
    @IsString({ message: 'shortDescription должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shortDescription не должно быть пустым!' })
    shortDescription: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста поста!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле content не должно быть пустым!' })
    content: string;
    @ApiProperty({ example: 'blogId', description: 'blogId блога в котором пост создается!' })
    @IsString({ message: 'blogId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле blogId не должно быть пустым!' })
    blogId: string;
    // @ApiProperty({ example: 'blogName', description: 'Имя блога в котором создается пост!' })
    // @IsString({ message: 'blogName должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле blogName не должно быть пустым!' })
    // blogName: string;
    // @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    // @IsString({ message: 'createdAt должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле createdAt не должно быть пустым!' })
    // createdAt: string;
    // @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    // @IsString({ message: 'updatedAt должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле updatedAt не должно быть пустым!' })
    // updatedAt: string;
    // @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    // @IsString({ message: 'deletedAt должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле deletedAt не должно быть пустым!' })
    // deletedAt: string | null;
}