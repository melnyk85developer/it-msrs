import { IsIn } from "class-validator";

export class DeleteMessageQueryDto {
    @IsIn(['me', 'all'], { message: 'deleteOption может быть только me или all!' })
    deleteOption: string;
}