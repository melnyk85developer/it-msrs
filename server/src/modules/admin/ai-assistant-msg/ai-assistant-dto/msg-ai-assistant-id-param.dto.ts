import { IsMongoId, IsString } from 'class-validator';

export class MsgAiAssistantIdParamDto {
    @IsMongoId({ message: 'Передан некорректный ID сообщения!' })
    // @IsString({ message: 'deleteOption должно быть строкой!' })
    msgId: string;
}