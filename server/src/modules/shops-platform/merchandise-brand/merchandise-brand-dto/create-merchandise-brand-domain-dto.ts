import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMerchandiseBrandDomainDto {
    @ApiProperty({ example: 'Apple', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'merchandiseBrandName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseBrandName не должно быть пустым!' })
    readonly merchandiseBrandName: string;

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