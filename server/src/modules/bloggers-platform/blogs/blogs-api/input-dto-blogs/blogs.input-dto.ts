import { OmitType } from "@nestjs/swagger";
import { CreateBlogDto } from "../../blogs-dto/create-blog.dto";

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateBlogInputDto extends OmitType(CreateBlogDto, ['createdAt', 'updatedAt', 'userId'] as const) {}