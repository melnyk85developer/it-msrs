import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsBooleanString, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Attachment } from "nodemailer/lib/mailer";

export class CreateInputMessageDto {
    @ApiProperty({ example: 'localId', description: 'Уникальный идентификатор сообщения!' })
    @IsString({ message: 'localId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле msgId не должно быть пустым!' })
    readonly localId: string;
    @ApiProperty({ example: 'Привет, как дела?', description: 'Текст сообщения.' })
    @IsString({ message: 'message должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле message не должно быть пустым!' })
    @Length(1, 8000, { message: 'Длина сообщения должена быть не меньше 1 и не больше 8000 символов!' })
    readonly message: string;
    @ApiProperty({ example: 'senderId', description: 'Уникальный идентификатор отправителя!' })
    @IsString({ message: 'senderId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле senderId не должно быть пустым!' })
    readonly senderId: string;
    @ApiProperty({ example: 'receiverId', description: 'Уникальный идентификатор получателя!' })
    @IsString({ message: 'receiverId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле receiverId не должно быть пустым!' })
    readonly receiverId: string;
    @ApiProperty({ example: '2', description: 'ID родительского сообщения, если это ответ' })
    @Transform(({ value }) =>
        value === 'undefined' || value === 'null' ? undefined : value
    )
    @IsOptional()
    readonly replyToMessageId?: string;
}