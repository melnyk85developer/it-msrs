import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class CreateTokenDomainDto {
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    @Length(1, 60, { message: 'Длина userId должена быть не меньше 1 и не больше 60 символов!' })
    readonly userId: string;
    @ApiProperty({ example: 'refreshToken', description: 'refreshToken!' })
    @IsString({ message: 'refreshToken должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле refreshToken не должно быть пустым!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    readonly refreshToken: string;

    // @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    // createdAt: string;
    // @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    // updatedAt: string;
    // @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    // deletedAt: string | null;
}
export class UpdateTokenDto {
    @ApiProperty({ example: 'id', description: 'Идентификатор обновляемого блога!' })
    @IsString({ message: 'id должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле id не должно быть пустым!' })
    @Length(1, 60, { message: 'id должено быть не меньше 1 и не больше 60 символов!' })
    id: string;
    @ApiProperty({ example: 'userId', description: 'Уникальный идентификатор пользователя (владелец блога)!' })
    @IsString({ message: 'userId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле userId не должно быть пустым!' })
    @Length(1, 60, { message: 'Длина userId должена быть не меньше 1 и не больше 60 символов!' })
    readonly userId: string;
    @ApiProperty({ example: 'refreshToken', description: 'refreshToken!' })
    @IsString({ message: 'refreshToken должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле refreshToken не должно быть пустым!' })
    @Length(1, 50, { message: 'Длина name должена быть не меньше 1 и не больше 15 символов!' })
    readonly refreshToken: string;

    // @ApiProperty({ example: 'createdAt', description: 'createdAt!' })
    // createdAt: string;
    // @ApiProperty({ example: 'updatedAt', description: 'updatedAt!' })
    // updatedAt: string;
    @ApiProperty({ example: 'deletedAt', description: 'deletedAt!' })
    deletedAt: string | null;
}