import { IsMongoId, IsString } from 'class-validator';

export class MessageIdParamDto {
    @IsMongoId({ message: 'Передан некорректный ID сообщения!' })
    // @IsString({ message: 'deleteOption должно быть строкой!' })
    msgId: string;
}