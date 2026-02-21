import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsStringWithTrim } from "src/core/decorators/validation/is-string-with-trim";

export class UpdatePostInputDto {
    // @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого поста!' })
    // id: string;
    @ApiProperty({ example: 'title', description: 'Заголовок поста!' })
    @IsString({ message: 'title должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле title не должно быть пустым!' })
    @IsStringWithTrim(3, 30)
    title: string;
    @ApiProperty({ example: 'shortDescription', description: 'Краткое описание!' })
    @IsString({ message: 'shortDescription должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле shortDescription не должно быть пустым!' })
    @IsStringWithTrim(3, 100)
    shortDescription: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста поста!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле content не должно быть пустым!' })
    @IsStringWithTrim(3, 1000)
    content: string;
    @ApiProperty({ example: 'blogId', description: 'blogId блога в котором пост создается!' })
    @IsString({ message: 'blogId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле blogId не должно быть пустым!' })
    blogId: string;
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
export class UpdatePostDomainDto {
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
    @ApiProperty({ example: 'blogName', description: 'Имя блога в котором создается пост!' })
    @IsString({ message: 'blogName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле blogName не должно быть пустым!' })
    blogName: string;
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