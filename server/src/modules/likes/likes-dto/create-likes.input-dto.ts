import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

// 1. Создаем реальный ENUM
export type LikeStatus = 'None' | 'Like' | 'Dislike'


export class CreateLikeInputDto {
    @ApiProperty({ example: 'likeStatus', description: 'Значение None или Like или Dislike!' })
    @IsString({ message: 'likeStatus должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле likeStatus не должно быть пустым!' })
    readonly likeStatus: LikeStatus
}