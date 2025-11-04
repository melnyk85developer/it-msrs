import { PostViewDto } from "./posts.view-dto";

export class ExtendedLikesInfoDto {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'Like' | 'Dislike' | 'None';
    newestLikes: Array<{ addedAt: string, userId: string, login: string }>;
}

export class PostExtendedViewDto extends PostViewDto {
    extendedLikesInfo: ExtendedLikesInfoDto;
}
