import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdateMerchandiseInfoDomainDto {
    @ApiProperty({ example: 'infoId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'infoId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле infoId не должно быть пустым!' })
    infoId: string

    @ApiProperty({ example: 'title', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'title должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле title не должно быть пустым!' })
    readonly title: string;

    @ApiProperty({ example: 'description', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'description должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле description не должно быть пустым!' })
    readonly description: string;

    @ApiProperty({ example: 'merchandiseId', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'merchandiseId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseId не должно быть пустым!' })
    readonly merchandiseId: string;

    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}