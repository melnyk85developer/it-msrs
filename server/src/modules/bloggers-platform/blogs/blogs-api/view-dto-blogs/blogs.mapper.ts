import { Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "src/modules/user.accounts/users-infrastructure/users-external-query/users-query-repository/users.query-repository";

import { BlogViewDto } from "./blogs.view-dto";
import { BlogDocument } from "../../blogs-domain/blog.entity";
import { BlogExtendedViewDto } from "./blogs-extended-view.dto";

@Injectable()
export class BlogMapper {
    constructor(
        // private readonly likesQueryRepository: LikesQueryRepository,
        private readonly usersQueryRepository: UsersQueryRepository,
    ) { }

    async toExtendedView(post: BlogDocument, userId: string | null): Promise<BlogExtendedViewDto> {
        const base = BlogViewDto.mapToBlogsView(post);
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
                const user = await this.usersQueryRepository.getUserByIdOrNotFoundFailQueryRepository(String(like.meta.userId));
                return {
                    addedAt: like.updatedAt,
                    userId: like.meta.userId,
                    login: user?.login ?? 'Unknown',
                };
            }));
        }

        // isLike = userId ? await this.likesQueryRepository.getLikeByIdRepository(String(post._id), 'post') : null;
        const myStatus = isLike ? isLike.likeStatus : 'None';

        return {
            ...base,
            extendedLikesInfo: {
                likesCount,
                dislikesCount,
                myStatus,
                newestLikes,
            },
        } as BlogExtendedViewDto;
    }
}
