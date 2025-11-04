import { BlogDocument } from "src/modules/bloggers-platform/blogs/blogs-domian/blog.entity";
import { UserDocument } from "src/modules/user.accounts/users-domian/user.entity";

export class BlogExternalDto {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;

    static mapToView(blog: BlogDocument): BlogExternalDto {
        const dto = new BlogExternalDto();

        dto.name = blog.name;
        dto.description = blog.description;
        dto.id = blog._id.toString();
        dto.websiteUrl = blog.websiteUrl;
        dto.createdAt = blog.createdAt;
        dto.isMembership = blog.isMembership;

        return dto;
    }
}