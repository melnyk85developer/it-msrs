import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UpdateBlogDto } from "../../blogs-dto/create-blog.dto";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateBlogInputDto {
    @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого блога!' })
    // @IsString({ message: 'id должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле id не должно быть пустым!' })
    id: string;
    @ApiProperty({ example: 'name', description: 'SamurayBlog!' })
    @IsString({ message: 'name должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    // @Length(1, 15, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    name: string;
    @ApiProperty({ example: 'description', description: 'Описание Блога!' })
    @IsString({ message: 'description должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле description не должно быть пустым!' })
    @Length(1, 500, { message: 'Длина description должена быть не меньше 1 и не больше 500 символов!' })
    description: string;
    @ApiProperty({ example: 'websiteUrl', description: 'Адрес сайта URL!' })
    @IsString({ message: 'websiteUrl должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле websiteUrl не должно быть пустым!' })
    @Length(1, 150, { message: 'Длина websiteUrl должена быть не меньше 1 и не больше 100 символов!' })
    @IsUrl()
    websiteUrl: string;
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор создателя блога!' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsOptional()
    userId: string;
    @ApiProperty({ example: 'createdAt', description: 'Дата создания!' })
    @IsString({ message: 'createdAt должно быть строкой!' })
    @IsOptional()
    createdAt: string | null;
    @ApiProperty({ example: 'updatedAt', description: 'Дата обновления!' })
    @IsString({ message: 'updatedAt должно быть строкой!' })
    @IsOptional()
    updatedAt: string | null;
    @IsOptional()
    deletedAt: string | null;
    @IsOptional()
    isMembership: boolean;
}