import { BlogDocument } from "../../blogs-domain/blog.entity";

export class BlogViewDto {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;

    static mapToBlogsView(user: BlogDocument): BlogViewDto {
        const dto = new BlogViewDto();

        dto.id = user._id.toString();
        dto.name = user.name;
        dto.description = user.description;
        dto.websiteUrl = user.websiteUrl;
        dto.createdAt = user.createdAt;
        dto.isMembership = user.isMembership;

        return dto;
    }
}