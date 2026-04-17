import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateMerchandiseTypeDomainDto {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    typeId: string

    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'albumName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле albumName не должно быть пустым!' })
    merchandiseTypeName: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор магазина' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsOptional()
    readonly userId?: string

    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор магазина' })
    @IsOptional()
    @IsString({ message: 'login должно быть строкой!' })
    readonly shopId?: string

    @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    createdAt: string;
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}