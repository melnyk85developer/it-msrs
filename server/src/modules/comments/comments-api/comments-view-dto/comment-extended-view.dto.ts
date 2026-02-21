import { CommentViewDto } from "./comments.view-dto";

export class LikesInfoDto {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'Like' | 'Dislike' | 'None';
}

export class CommentExtendedViewDto extends CommentViewDto {
    likesInfo: LikesInfoDto;
}
