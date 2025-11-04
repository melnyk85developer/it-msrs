import { OmitType } from "@nestjs/swagger";
import { UpdateCommentDto } from "../../comments-dto/create-comments.dto";

export class UpdateCommentInputDto extends OmitType(UpdateCommentDto, ['deletedAt', 'createdAt', 'updatedAt'] as const) {}