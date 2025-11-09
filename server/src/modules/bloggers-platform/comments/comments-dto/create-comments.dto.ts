import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({ example: 'postId', description: 'Идентификатор поста создаваемого комментария!' })
    @IsString({ message: 'postId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле postId не должно быть пустым!' })
    @Length(1, 60, { message: 'postId должено быть не меньше 1 и не больше 60 символов!' })
    readonly postId: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly content: string;
    @ApiProperty({ example: 'commentatorInfo', description: 'Информация о пользователе оставившего комментарий!' })
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
}

export class UpdateCommentDto {
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
    @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    updatedAt: string;
}