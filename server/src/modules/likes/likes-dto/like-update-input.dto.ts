import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { LikeStatus } from "./like-update.dto";

export class UpdateLikeInputDto {
    @ApiProperty({ example: 'Like', description: 'None | Like | Dislike' })
    @IsEnum(LikeStatus, { message: 'likeStatus должно быть одним из: None, Like, Dislike' })
    @IsNotEmpty({ message: 'Поле likeStatus не должно быть пустым!' })
    readonly likeStatus: LikeStatus;
}