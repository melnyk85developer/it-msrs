import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { MetaType } from "../likes-domain/meta-type-likes.schema";
import { LikeStatus } from "./like-update.dto";

export class CreateLikeDomainDto {
    @ApiProperty({ example: 'Like', description: 'None | Like | Dislike' })
    @IsEnum(LikeStatus, { message: 'likeStatus должно быть одним из: None, Like, Dislike' })
    @IsNotEmpty({ message: 'Поле likeStatus не должно быть пустым!' })
    readonly likeStatus: LikeStatus;
    @ApiProperty({ example: 'likeStatus', description: 'Значение None или Like или Dislike!' })
    @IsString({ message: 'likeStatus должно быть строкой!' })
    @IsNotEmpty({ message: 'Поле likeStatus не должно быть пустым!' })
    readonly meta: MetaType;
}