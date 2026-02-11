import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateReadInputMessageDto {
    @ApiProperty({ example: 'msgId', description: 'Уникальный идентификатор сообщения!' })
    @IsString({ message: 'msgId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле msgId не должно быть пустым!' })
    readonly msgId: string;
    @ApiProperty({ example: 'true', description: 'Является ли сообщение прочитанным или нет?' })
    @IsBoolean({ message: 'read должно быть boolean!' })
    readonly read: boolean;
}