import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class UpdateMessageReadDomainDto {
    @ApiProperty({ example: 'msgId', description: 'Уникальный идентификатор сообщения!' })
    @IsString({ message: 'msgId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле msgId не должно быть пустым!' })
    readonly msgId: string;
    @ApiProperty({ example: 'true', description: 'Является ли сообщение прочитанным или нет?' })
    @IsBoolean({ message: 'read должно быть boolean!' })
    @IsNotEmpty({ message: 'Поле read не должно быть пустым!' })
    readonly read: boolean;
}