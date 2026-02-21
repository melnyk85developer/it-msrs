import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { IsStringWithTrim } from "src/core/decorators/validation/is-string-with-trim";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreatePostForBlogInputDto {
    @ApiProperty({ example: 'title', description: 'Заголовок поста!' })
    @IsString({ message: 'title должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле title не должно быть пустым!' })
    // @Length(3, 30, { message: 'Поле title должно быть не менее 3 и не более 60 символов!' })
    @IsStringWithTrim(3, 30)
    readonly title: string;
    @ApiProperty({ example: 'shortDescription', description: 'Краткое описание привью поста!' })
    @IsString({ message: 'shortDescription должно быть строкой!' })
    @IsNotEmpty({ message: 'shortDescription должно быть обязательно!' })
    // @Length(3, 100, { message: 'shortDescription должно быть не менее 3 и не более 500 символов!!' })
    @IsStringWithTrim(3, 100)
    readonly shortDescription: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста поста!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле content не должно быть пустым!' })
    // @Length(3, 1000, { message: 'Поле content должно быть не менее 3 и не более 8000 символов!' })
    @IsStringWithTrim(3, 1000)
    readonly content: string;
    // @IsNotEmpty({ message: 'Поле blogId не должно быть пустым!' })
    // @IsString({ message: 'blogId должно быть строкой!' })
    // blogId: string;
}