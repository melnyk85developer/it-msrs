import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdateMerchandiseDto {
    @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого блога!' })
    @IsString({ message: 'id должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле id не должно быть пустым!' })
    productId: string;

    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя' })
    @IsString({ message: 'login должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле login не должно быть пустым!' })
    userId: string

    @ApiProperty({ example: 'merchandiseName', description: 'Уникальный идентификатор фото' })
    @IsString({ message: 'merchandiseName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseName не должно быть пустым!' })
    merchandiseName: string;

    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'merchandiseImgName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseImgName не должно быть пустым!' })
    merchandiseImgName: string;

    @ApiProperty({ example: 'Новогодние Фото', description: 'Новогодняя подборка 2024' })
    @IsString({ message: 'merchandiseCoverName должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле merchandiseCoverName не должно быть пустым!' })
    merchandiseCoverName: string;
}