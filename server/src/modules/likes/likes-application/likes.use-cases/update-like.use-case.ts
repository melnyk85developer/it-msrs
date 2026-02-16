import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLikeDto } from '../../likes-dto/like-update.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Like, type LikeModelType } from '../../likes-domain/like.entity';
import { LikesRepository } from '../../likes-infrastructure/likesRepository';

export class UpdateLikeCommand {
    constructor(
        public userId: string,
        public entityId: string,
        public dto: Omit<UpdateLikeDto, 'meta'>,
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
        private likesRepository: LikesRepository
    ) { }
    async execute(command: UpdateLikeCommand): Promise<string> {
        const { userId, entityId, entityType, dto } = command;
        // console.log('LikesServices: - likeUpdateCommentServices 😡 entity, likeStatus, entityId, userId', entity, likeStatus, entityId, userId)
        const date = new Date().toISOString()
        const like = await this.likesRepository.findlikeOrNotFoundFailRepository(
            entityType,
            entityId,
        )

        like.updateLike({
            id: like.id,
            likeStatus: dto.likeStatus,
            meta: {
                entityType: entityType,
                entityId,
                userId
            }
        })
        await this.likesRepository.save(like);
        return like._id.toString();
    }
}