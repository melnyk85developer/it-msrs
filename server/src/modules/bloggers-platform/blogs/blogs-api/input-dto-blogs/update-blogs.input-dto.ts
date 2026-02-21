import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UpdateBlogDto } from "../../blogs-dto/create-blog.dto";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { IsStringWithTrim } from "src/core/decorators/validation/is-string-with-trim";

export class UpdateBlogInputDto {
    @ApiProperty({ example: 'name', description: 'SamurayBlog!' })
    @IsStringWithTrim(1, 15)
    @IsString({ message: 'name должно быть строкой!' })
    name: string;
    @ApiProperty({ example: 'description', description: 'Описание Блога!' })
    @IsString({ message: 'description должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле description не должно быть пустым!' })
    // @Length(1, 500, { message: 'Длина description должена быть не меньше 1 и не больше 500 символов!' })
    @IsStringWithTrim(1, 500)
    description: string;
    @ApiProperty({ example: 'websiteUrl', description: 'Адрес сайта URL!' })
    @IsString({ message: 'websiteUrl должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле websiteUrl не должно быть пустым!' })
    // @Length(1, 100, { message: 'Длина websiteUrl должена быть не меньше 1 и не больше 100 символов!' })
    @IsStringWithTrim(1, 100)
    @IsUrl()
    websiteUrl: string;
}