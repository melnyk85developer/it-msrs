import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Like, type LikeModelType } from '../../likes-domain/like.entity';
import { LikesRepository } from '../../likes-infrastructure/likesRepository';
import { PostsRepository } from 'src/modules/bloggers-platform/posts/posts-infrastructure/posts.repository';
import { CommentsRepository } from 'src/modules/comments/comments-infrastructure/comments.repository';
import { PhotoRepository } from 'src/modules/gallery/photos/photos-infrastructure/photos-repository';
import { LikeStatus } from '../../likes-dto/like-update.dto';

export class UpdateLikeCommand {
    constructor(
        public userId: string,
        public entityId: string,
        public likeStatus: LikeStatus,
        public entityType: string
    ) { }
}

@CommandHandler(UpdateLikeCommand)
export class UpdateLikeUseCase
    implements ICommandHandler<UpdateLikeCommand, string> {
    constructor(
        @InjectModel(Like.name) private LikeModel: LikeModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private likesRepository: LikesRepository,
        private postsRepository: PostsRepository,
        private commentsRepository: CommentsRepository,
        private photoRepository: PhotoRepository,
    ) { }
    async execute(command: UpdateLikeCommand): Promise<string> {
        const { userId, entityId, entityType, likeStatus } = command;
        // console.log('UpdateLikeUseCase: - likeStatus 😡 ', likeStatus)

        if (entityType === 'post') {
            await this.postsRepository.findPostOrNotFoundFail(entityId);
        }
        if (entityType === 'comment') {
            await this.commentsRepository.findCommentOrNotFoundFailRepository(entityId);
        }
        if (entityType === 'photo') {
            await this.photoRepository.findPhotoByIdOrNotFoundFailRepository(entityId);
        }
        // if (entityType === 'video') {
        //     await this.postsRepository.findPostOrNotFoundFail(entityId);
        // }

        let like = await this.likesRepository.findUserLikeForEntity(
            userId,
            entityType,
            entityId,
        );
        // 🔹 Если лайка нет — создаём
        if (!like) {
            // console.log('UpdateLikeUseCase: - like1 IF 😡 ', like)
            like = this.LikeModel.createLikeInstance({
                likeStatus,
                meta: {
                    entityType,
                    entityId,
                    userId,
                }
            });
            // console.log('UpdateLikeUseCase: - like2 IF 😡 ', like)
            await this.likesRepository.save(like);
            // console.log('UpdateLikeUseCase: - like3 IF 😡 ', like)
            return like.id.toString();
        }
        // console.log('UpdateLikeUseCase: findlikeOrNotFoundFailRepository - like1 😡 ', like)
        // 🔹 Если есть — обновляем
        like.updateLike({
            id: like.id,
            likeStatus,
            meta: {
                entityType,
                entityId,
                userId,
            }
        });
        // console.log('UpdateLikeUseCase: like.updateLike like2 😡 ', like)
        await this.likesRepository.save(like);
        // console.log('UpdateLikeUseCase: like.updateLike like3 😡 ', like)
        return like.id.toString();
    }
}