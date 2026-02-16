import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateCommentInputDto {
    @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого комментария!' })
    @IsString({ message: 'id должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле postId не должно быть пустым!' })
    @Length(1, 60, { message: 'id должено быть не меньше 1 и не больше 60 символов!' })
    readonly id: string;
    @IsString({ message: 'postId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле postId не должно быть пустым!' })
    @Length(1, 60, { message: 'postId должено быть не меньше 1 и не больше 60 символов!' })
    readonly postId: string;
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле content не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    content: string;
    // @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    // updatedAt: string;
}