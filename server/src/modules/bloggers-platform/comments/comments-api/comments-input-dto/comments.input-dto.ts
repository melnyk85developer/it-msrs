import { OmitType } from "@nestjs/swagger";
import { CreateCommentDto } from "../../comments-dto/create-comments.dto";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateCommentInputDto extends OmitType(CreateCommentDto, ['deletedAt', 'createdAt', 'updatedAt'] as const) {}