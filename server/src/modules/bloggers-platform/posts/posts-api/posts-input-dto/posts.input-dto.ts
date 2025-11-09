import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreatePostDto, CreatePostForBlogDto } from "../../posts-dto/create-post.dto";
import { IsNotEmpty, IsString, Length } from "class-validator";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreatePostInputDto implements CreatePostDto {
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
}