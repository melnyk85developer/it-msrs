import { IsIn } from "class-validator";

export class DeleteAiAssistantMsgQueryDto {
    @IsIn(['me', 'all'], { message: 'deleteOption может быть только me или all!' })
    deleteOption: string;
}