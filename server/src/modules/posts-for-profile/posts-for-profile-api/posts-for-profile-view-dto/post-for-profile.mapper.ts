import { Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "src/modules/user.accounts/users-infrastructure/users.query-repository";
import { PostForProfileExtendedViewDto } from "./post-for-profile-extended-view.dto";
import { PostForProfileViewDto } from "./posts-for-profile.view-dto";
import { PostForProfileDocument } from "../../posts-domain/posts-for-profile-entity";

@Injectable()
export class PostForProfileMapper {
    constructor(
        // private readonly likesQueryRepository: LikesQueryRepository,
        private readonly usersQueryRepository: UsersQueryRepository,
    ) { }

    async toExtendedView(post: PostForProfileDocument, userId: string | null): Promise<PostForProfileExtendedViewDto> {
        const base = PostForProfileViewDto.mapToViewPosts(post);
        let likesCount = 0
        let dislikesCount = 0
        let allLikes
        let isLike

        // likesCount = await this.likesQueryRepository.getAllLikeForCommentRepository(String(post._id), 'post', 'Like');
        // dislikesCount = await this.likesQueryRepository.getAllLikeForCommentRepository(String(post._id), 'post', 'Dislike');
        // allLikes = await this.likesQueryRepository.getAllLikesCommentRepository(String(post._id), 'post');

        let newestLikes = [];
        if (allLikes?.length) {
            const latest = allLikes
                .filter(l => l.likeStatus === 'Like')
                .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
                .slice(0, 3);
            // @ts-ignore
            newestLikes = await Promise.all(latest.map(async like => {
                const user = await this.usersQueryRepository.getUserByIdOrNotFoundFail(String(like.meta.userId));
                return {
                    addedAt: like.updatedAt,
                    userId: like.meta.userId,
                    login: user?.login ?? 'Unknown',
                };
            }));
        }

        const profile = await this.usersQueryRepository.getProfileQueryRepository(base.userId);

        // isLike = userId ? await this.likesQueryRepository.getLikeByIdRepository(String(post._id), 'post') : null;
        const myStatus = isLike ? isLike.likeStatus : 'None';

        return {
            ...base,
            authorPost: {
                avatar: profile.avatar,
                name: profile.name ? profile.name : profile.login,
                surname: profile.surname ? profile.surname : profile.email
            },
            extendedLikesInfo: {
                likesCount,
                dislikesCount,
                myStatus,
                newestLikes,
            },
        } as PostForProfileExtendedViewDto;
    }
}
