import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateBlogDto } from "../../blogs-dto/create-blog.dto";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateBlogInputDto {
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
}
// export class CreateCommentInputDto extends OmitType(
//     CreateCommentDto, [
//         'deletedAt',
//         'createdAt',
//         'updatedAt'
//     ] as const
// ) { }