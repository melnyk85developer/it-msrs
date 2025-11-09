import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UpdatePostDto } from "../../posts-dto/create-post.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePostInputDto implements UpdatePostDto {
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
}