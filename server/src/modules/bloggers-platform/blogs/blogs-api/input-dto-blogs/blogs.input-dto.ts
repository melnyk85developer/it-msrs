import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateBlogDto } from "../../blogs-dto/create-blog.dto";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
import { IsStringWithTrim } from "src/core/decorators/validation/is-string-with-trim";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateBlogInputDto {
    @ApiProperty({ example: 'name', description: 'SamurayBlog!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    @IsStringWithTrim(1, 15)
    readonly name: string;
    @ApiProperty({ example: 'description', description: 'Описание Блога!' })
    @IsString({ message: 'description должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле description не должно быть пустым!' })
    // @Length(1, 500, { message: 'Длина description должена быть не меньше 1 и не больше 500 символов!' })
    @IsStringWithTrim(1, 500)
    readonly description: string;
    @ApiProperty({ example: 'websiteUrl', description: 'Адрес сайта URL!' })
    @IsString({ message: 'websiteUrl должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле websiteUrl не должно быть пустым!' })
    // @Length(1, 150, { message: 'Длина websiteUrl должена быть не меньше 1 и не больше 150 символов!' })
    @IsStringWithTrim(1, 100)
    @IsUrl()
    readonly websiteUrl: string;
}
// export class CreateCommentInputDto extends OmitType(
//     CreateCommentDto, [
//         'deletedAt',
//         'createdAt',
//         'updatedAt'
//     ] as const
// ) { }