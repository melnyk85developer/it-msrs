import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { MetaType } from "../likes-domain/meta-type-likes.schema";

export class UpdateLikeDto {
    @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого комментария!' })
    @IsString({ message: 'id должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле postId не должно быть пустым!' })
    @Length(1, 60, { message: 'id должено быть не меньше 1 и не больше 60 символов!' })
    readonly id: string;
    @ApiProperty({ example: 'likeStatus', description: 'Значение None или Like или Dislike!' })
    @IsString({ message: 'likeStatus должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле likeStatus не должно быть пустым!' })
    readonly likeStatus: 'None' | 'Like' | 'Dislike'
    @ApiProperty({ example: 'likeStatus', description: 'Значение None или Like или Dislike!' })
    @IsString({ message: 'likeStatus должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле likeStatus не должно быть пустым!' })
    readonly meta: MetaType;
}