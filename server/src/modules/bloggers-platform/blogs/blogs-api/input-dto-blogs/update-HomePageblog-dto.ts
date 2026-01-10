import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UpdateBlogDto } from "../../blogs-dto/create-blog.dto";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateHomePageBlogDto {
    @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого блога!' })
    // @IsString({ message: 'id должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле id не должно быть пустым!' })
    id: string;

    @ApiProperty({ example: 'titleHome', description: 'Заголовок главной страницы блога!' })
    @IsString({ message: 'titleHome должно быть строкой!' })
    @IsOptional()
    titleHome?: string | null;

    @ApiProperty({ example: 'subtitleHome', description: 'Подаголовок главной страницы блога!' })
    @IsString({ message: 'subtitleHome должно быть строкой!' })
    @IsOptional()
    subtitleHome?: string | null;

    @ApiProperty({ example: 'contentHome', description: 'Контент главной страницы блога!' })
    @IsString({ message: 'contentHome должно быть строкой!' })
    @IsOptional()
    contentHome?: string | null;

    @ApiProperty({ example: 'ctaTextHome', description: 'Контент главной страницы блога!' })
    @IsString({ message: 'ctaTextHome должно быть строкой!' })
    @IsOptional()
    ctaTextHome?: string | null;

    @ApiProperty({
        example: 'https://myblog.com/posts',
        description: 'Ссылка для кнопки призыва к действию (CTA) на главной странице блога',
    })
    @IsString({ message: 'ctaLinkHome должно быть строкой!' })
    @IsOptional()
    ctaLinkHome?: string | null;

    @ApiProperty({
        example: 'Блог о веб-разработке, архитектуре и реальных проектах',
        description: 'SEO-описание (meta description) главной страницы блога',
    })
    @IsString({ message: 'seoDescriptionHome должно быть строкой!' })
    @IsOptional()
    seoDescriptionHome?: string | null;

    @ApiProperty({ example: 'titleAbout', description: 'Заголовок страницы блога О Нас!' })
    @IsString({ message: 'titleAbout должно быть строкой!' })
    @IsOptional()
    titleAbout?: string | null;

    @ApiProperty({ example: 'subtitleAbout', description: 'Подаголовок страницы блога О Нас!' })
    @IsString({ message: 'subtitleAbout должно быть строкой!' })
    @IsOptional()
    subtitleAbout?: string | null;

    @ApiProperty({ example: 'contentAbout', description: 'Контент страницы блога О Нас!' })
    @IsString({ message: 'contentAbout должно быть строкой!' })
    @IsOptional()
    contentAbout?: string | null;

    @ApiProperty({
        example: 'Наша миссия — создавать открытые и честные блоги для разработчиков',
        description: 'Миссия и ключевые ценности блога, отображаемые на странице «О нас»',
    })
    @IsString({ message: 'missionAbout должно быть строкой!' })
    @IsOptional()
    missionAbout?: string | null;

    @ApiProperty({
        example: 'Узнайте больше о нашей команде, ценностях и целях блога',
        description: 'SEO-описание (meta description) страницы «О нас» блога',
    })
    @IsString({ message: 'seoDescriptionAbout должно быть строкой!' })
    @IsOptional()
    seoDescriptionAbout?: string | null;
}