import { OmitType } from "@nestjs/swagger";
import { UpdatePostDto } from "../../posts-dto/create-post.dto";

export class UpdatePostInputDto extends OmitType(UpdatePostDto, ['deletedAt', 'createdAt', 'updatedAt'] as const) {}