import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, Length } from "class-validator";
import { AuthorPost } from "../../posts-domain/author-post-shema";

export class UpdatePostForProfileInputDto {
    // @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого блога!' })
    // @IsString({ message: 'id должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле id не должно быть пустым!' })
    // postId: string;
    @ApiProperty({ example: 'Контент', description: 'Текст поста' })
    @IsString({ message: 'refreshToken должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле refreshToken не должно быть пустым!' })
    @Length(1, 500, { message: 'Длина name должена быть не меньше 1 и не больше 500 символов!' })
    title: string;
    @ApiProperty({ example: 'content', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле content не должно быть пустым!' })
    @Length(1, 8000, { message: 'Длина content должена быть не меньше 1 и не больше 8000 символов!' })
    content: string;
    // @ApiProperty({ example: 'image', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    // @IsOptional()
    // @IsString({ message: 'image должно быть строкой!' })
    // image?: string;
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'profileId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле profileId не должно быть пустым!' })
    profileId: string;
}
export class UpdatePostForProfileDto {
    // @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого блога!' })
    // @IsString({ message: 'id должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле id не должно быть пустым!' })
    // postId: string;
    @ApiProperty({ example: 'Контент', description: 'Текст поста' })
    @IsString({ message: 'refreshToken должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле refreshToken не должно быть пустым!' })
    @Length(1, 500, { message: 'Длина name должена быть не меньше 1 и не больше 500 символов!' })
    title: string;
    @ApiProperty({ example: 'content', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле content не должно быть пустым!' })
    @Length(1, 8000, { message: 'Длина content должена быть не меньше 1 и не больше 8000 символов!' })
    content: string;
    // @ApiProperty({ example: 'image', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    // @IsOptional()
    // @IsString({ message: 'image должно быть строкой!' })
    // image?: string;
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'profileId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле profileId не должно быть пустым!' })
    profileId: string;
}
export class UpdatePostForProfileDomainDto {
    @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого блога!' })
    @IsString({ message: 'id должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле id не должно быть пустым!' })
    postId: string;
    @ApiProperty({ example: 'Контент', description: 'Текст поста' })
    @IsString({ message: 'refreshToken должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле refreshToken не должно быть пустым!' })
    @Length(1, 500, { message: 'Длина name должена быть не меньше 1 и не больше 500 символов!' })
    title: string;
    @ApiProperty({ example: 'content', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'content должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле content не должно быть пустым!' })
    @Length(1, 8000, { message: 'Длина content должена быть не меньше 1 и не больше 8000 символов!' })
    content: string;
    @ApiProperty({ example: 'image', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsOptional()
    @IsString({ message: 'image должно быть строкой!' })
    image: string | null;

    @ApiProperty({
        example: 'id пользователя который выложил пост',
        description: 'Уникальный идентификатор пользователя'
    })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    userId: string;
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'profileId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле profileId не должно быть пустым!' })
    profileId: string;
}