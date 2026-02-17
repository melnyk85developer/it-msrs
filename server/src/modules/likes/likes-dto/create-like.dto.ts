import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { MetaType } from "../likes-domain/meta-type-likes.schema";
import { LikeStatus } from "./create-likes.input-dto";

export class CreateLikeDto {
    @ApiProperty({ example: 'likeStatus', description: 'Значение None или Like или Dislike!' })
    @IsString({ message: 'likeStatus должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле likeStatus не должно быть пустым!' })
    readonly likeStatus: string
    @ApiProperty({ example: 'likeStatus', description: 'Значение None или Like или Dislike!' })
    @IsString({ message: 'likeStatus должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле likeStatus не должно быть пустым!' })
    readonly meta: MetaType;
}