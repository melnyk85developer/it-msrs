import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class DeleteAiAssistantAllMesgsQueryDto {
    @ApiProperty({ example: 'deleteOption', description: 'Идентификатор me или all!' })
    @IsString({ message: 'deleteOption должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле receiverId не должно быть пустым!' })
    @IsIn(['me', 'all'], { message: 'deleteOption может быть только me или all!' })
    deleteOption: string;
    @ApiProperty({ example: 'receiverId', description: 'Уникальный идентификатор сообщения!' })
    // @IsString({ message: 'receiverId должно быть строкой!' })
    @IsMongoId({ message: 'Передан некорректный ID сообщения!' })
    @IsNotEmpty({ message: 'Поле receiverId не должно быть пустым!' })
    receiverId: string;
    @ApiProperty({ example: 'senderId', description: 'Уникальный идентификатор сообщения!' })
    // @IsString({ message: 'senderId должно быть строкой!' })
    @IsMongoId({ message: 'Передан некорректный ID сообщения!' })
    @IsNotEmpty({ message: 'Поле senderId не должно быть пустым!' })
    senderId: string;
}