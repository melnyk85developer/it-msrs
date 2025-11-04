import { CommentDocument } from "../../../comments-domian/comments.entity";

export class CommentExternalDto {
    id: string;
    postId: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;

    static mapToView(post: CommentDocument): CommentExternalDto {
        const dto = new CommentExternalDto();

        dto.id = post._id.toString();
        dto.postId = post.postId;
        dto.content = post.content;
        dto.commentatorInfo = post.commentatorInfo;
        dto.createdAt = post.createdAt;

        return dto;
    }
}