import { CommentDocument } from "../../comments-domian/comments.entity";

export class CommentViewDto {
    id: string;
    content: string;
    // postId: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;

    static mapToView(comment: CommentDocument): CommentViewDto {
        const dto = new CommentViewDto();

        dto.id = comment._id.toString();
        dto.content = comment.content;
        // dto.postId = comment.postId;
        dto.commentatorInfo = comment.commentatorInfo;
        dto.createdAt = comment.createdAt;

        return dto;
    }
}