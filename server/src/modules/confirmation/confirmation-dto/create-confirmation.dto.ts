import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Types } from "mongoose";

export class ConfirmationCommentDto {
    @ApiProperty({ example: 'postId', description: 'Идентификатор поста создаваемого комментария!' })
    @IsString({ message: 'postId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле postId не должно быть пустым!' })
    @Length(1, 60, { message: 'postId должено быть не меньше 1 и не больше 60 символов!' })
    readonly confirmationCode: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsBoolean({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly isBlocked: boolean;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly field: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly userId: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly lastActiveDate: Date;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly expirationDate: Date;
}

export class UpdateConfirmationDto {
    @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого комментария!' })
    @IsString({ message: 'id должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле postId не должно быть пустым!' })
    @Length(1, 60, { message: 'id должено быть не меньше 1 и не больше 60 символов!' })
    readonly id: string;

    @ApiProperty({ example: 'postId', description: 'Идентификатор поста создаваемого комментария!' })
    @IsString({ message: 'postId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле postId не должно быть пустым!' })
    @Length(1, 60, { message: 'postId должено быть не меньше 1 и не больше 60 символов!' })
    readonly confirmationCode: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsBoolean({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly isBlocked: boolean;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly field: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly userId: string;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly lastActiveDate: Date;
    @ApiProperty({ example: 'content', description: 'Поле content для текста комментария!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле сontent не должно быть пустым!' })
    @Length(3, 3000, { message: 'Длина символов поля content должно быть не менеее 3 и не более 3000 символов!' })
    readonly expirationDate: Date;
}