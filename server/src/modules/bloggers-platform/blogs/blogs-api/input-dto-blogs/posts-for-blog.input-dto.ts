import { OmitType } from "@nestjs/swagger";
import { CreatePostForBlogDto } from "src/modules/bloggers-platform/posts/posts-dto/create-post.dto";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreatePostForBlogInputDto extends OmitType(CreatePostForBlogDto, ['deletedAt', 'createdAt', 'updatedAt'] as const) {}