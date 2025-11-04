export class CreateCommentDomainDto {
    postId: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null
}