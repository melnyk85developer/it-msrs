import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, type CommentModelType } from '../comments-domian/comments.entity';
import { CreateCommentDto, UpdateCommentDto } from '../comments-dto/create-comments.dto';
import { CommentsRepository } from '../comments-infrastructure/comments.repository';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
        private commentsRepository: CommentsRepository
    ) { }

    async createCommentService(dto: Omit<CreateCommentDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<string> {
        const date = new Date();
        const createdAt = date.toISOString();
        const updatedAt = date.toISOString();
        // console.log('CommentsService: createCommentService - dto 😡 ', dto)
        const commentData = {
            ...dto,
            commentatorInfo: {
                userId: '123',
                userLogin: 'MrRobot'
            },
            createdAt: createdAt,
            updatedAt: updatedAt,
            deletedAt: null
        }

        const comment = this.CommentModel.createInstance(commentData);

        await this.commentsRepository.save(comment);
        return comment._id.toString();
    }
    async updateCommentService(id: string, dto: Omit<UpdateCommentDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<string> {
        const comment = await this.commentsRepository.findCommentOrNotFoundFailRepository(id);
        const date = new Date();
        const createdAt = date.toISOString();
        const updatedAt = date.toISOString();
        // не присваиваем св-ва сущностям напрямую в сервисах! даже для изменения одного св-ва
        // создаём метод
        comment.update({
            ...dto,
            createdAt: createdAt,
            updatedAt: updatedAt,
            deletedAt: null
        }); // change detection
        await this.commentsRepository.save(comment)
        return comment._id.toString();
    }
    async deleteCommentService(id: string) {
        const comment = await this.commentsRepository.findCommentOrNotFoundFailRepository(id);
        comment.makeDeleted();
        await this.commentsRepository.save(comment);
    }
}