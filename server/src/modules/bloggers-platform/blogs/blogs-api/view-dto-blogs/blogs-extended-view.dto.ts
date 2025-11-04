import { BlogViewDto } from "./blogs.view-dto";


export class ExtendedLikesInfoDto {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'Like' | 'Dislike' | 'None';
    newestLikes: Array<{ addedAt: string, userId: string, login: string }>;
}

export class BlogExtendedViewDto extends BlogViewDto {
    extendedLikesInfo: ExtendedLikesInfoDto;
}
