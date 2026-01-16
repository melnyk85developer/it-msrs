import { PostForProfileViewDto } from "./posts-for-profile.view-dto";

export class ExtendedLikesInfoDto {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'Like' | 'Dislike' | 'None';
    newestLikes: Array<{ addedAt: string, userId: string, login: string }>;
}

export class PostForProfileExtendedViewDto extends PostForProfileViewDto {
    extendedLikesInfo: ExtendedLikesInfoDto;
}
