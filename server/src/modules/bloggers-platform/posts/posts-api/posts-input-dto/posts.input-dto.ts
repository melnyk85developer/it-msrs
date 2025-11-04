import { OmitType } from "@nestjs/swagger";
import { CreatePostDto, CreatePostForBlogDto } from "../../posts-dto/create-post.dto";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreatePostInputDto extends OmitType(CreatePostDto, ['deletedAt', 'createdAt', 'updatedAt'] as const) {}