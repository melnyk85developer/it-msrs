import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { Attachment } from "nodemailer/lib/mailer";

export class UpdateMessageDomainDto {
    @ApiProperty({ example: 'msgId', description: 'Уникальный идентификатор сообщения!' })
    @IsString({ message: 'msgId должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле msgId не должно быть пустым!' })
    readonly msgId: string;
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
    // @ApiProperty({ example: 'true', description: 'Является ли сообщение прочитанным или нет?' })
    // @IsBoolean({ message: 'read должно быть boolean!' })
    // @IsNotEmpty({ message: 'Поле read не должно быть пустым!' })
    // readonly read: boolean;
    // @ApiProperty({ example: 'true', description: 'Уникальный идентификатор диалога!' })
    // @IsString({ message: 'dialogId должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле dialogId не должно быть пустым!' })
    // readonly dialogId: string;

    // @ApiProperty({ example: 'true', description: 'Уникальный идентификатор диалога!' })
    // @IsNotEmpty({ message: 'Поле dialogId не должно быть пустым!' })
    // readonly meta: any[];

    @ApiProperty({ example: '2', description: 'ID родительского сообщения, если это ответ' })
    @IsString({ message: 'replyToMessageId должно быть строкой!' })
    @IsOptional()
    readonly replyToMessageId: string | null;

    @ApiProperty({ example: '2', description: 'ID родительского сообщения, если это ответ' })
    @IsOptional()
    readonly attachments: Attachment[];
}