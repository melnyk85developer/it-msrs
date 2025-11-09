import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { CreateCommentDto } from "../../comments-dto/create-comments.dto";

export class CreateCommentInputDto {
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
}
// export class CreateCommentInputDto extends OmitType(
//     CreateCommentDto, [
//         'createdAt',
//         'updatedAt',
//         'deletedAt'
//     ] as const
// ) {
//     @ApiProperty({ example: 'postId', description: 'Идентификатор поста создаваемого комментария!' })
//     @IsString({ message: 'postId должно быть строкой!' })
//     @IsNotEmpty({ message: 'Поле postId не должно быть пустым!' })
//     @Length(1, 60, { message: 'postId должено быть не меньше 1 и не больше 60 символов!' })
//     readonly postId: string;
//     @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
//     @IsString({ message: 'content должно быть строкой!' })
//     @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
//     @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
//     readonly content: string;
// }