import { OmitType } from "@nestjs/swagger";
import { UpdateBlogDto } from "../../blogs-dto/create-blog.dto";

export class UpdateBlogInputDto extends OmitType(UpdateBlogDto, ['isMembership', 'updatedAt'] as const) {}