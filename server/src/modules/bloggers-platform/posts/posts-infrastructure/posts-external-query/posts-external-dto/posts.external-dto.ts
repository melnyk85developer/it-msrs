import { Types } from "mongoose";
import { PostDocument } from "../../../posts-domain/post.entity";

export class PostExternalDto {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;

    static mapToView(post: PostDocument): PostExternalDto {
        const dto = new PostExternalDto();

        dto.id = post._id.toString();
        dto.title = post.title;
        dto.shortDescription = post.shortDescription;
        dto.content = post.content;
        dto.blogId = post.blogId;
        dto.blogName = post.blogName;
        dto.createdAt = post.createdAt;

        return dto;
    }
}