import { Multer } from 'multer';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { LikesRepository } from '../../likes-infrastructure/likesRepository';
import { CreateLikeDto } from '../../likes-dto/create-like.dto';
import { Like, type LikeModelType } from '../../likes-domain/like.entity';

export class CreateLikeCommand {
    constructor(
        public userId: string,
        public entityId: string,
        public dto: Omit<CreateLikeDto, 'meta'>,
        public entityType: string
    ) { }
}

@CommandHandler(CreateLikeCommand)
export class CreateLikeUseCase
    implements ICommandHandler<CreateLikeCommand, string> {
    constructor(
        @InjectModel(Like.name) private LikeModel: LikeModelType,
        private commandBus: CommandBus,
        private eventBus: EventBus,
        private likesRepository: LikesRepository
    ) { }
    async execute(command: CreateLikeCommand): Promise<string> {
        const { entityId, userId, dto, entityType } = command;

        const like = this.LikeModel.createLikeInstance({
            ...dto,
            meta: {
                entityType: entityType,
                entityId, 
                userId
            }
        });
        await this.likesRepository.save(like);
        return like._id.toString();
    }
}