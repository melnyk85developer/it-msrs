import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, type CommentModelType } from '../comments-domain/comments.entity';
import { CreateCommentDto, UpdateCommentDto } from '../comments-dto/create-comments.dto';
import { CommentsRepository } from '../comments-infrastructure/comments.repository';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
        private commentsRepository: CommentsRepository
    ) { }

    async createCommentService(dto: Omit<CreateCommentDto, 'commentatorInfo'>): Promise<string> {
        const commentData = {
            ...dto,
            commentatorInfo: {
                userId: '123',
                userLogin: 'MrRobot'
            }
        }
        const comment = this.CommentModel.createCommentInstance(commentData);
        await this.commentsRepository.save(comment);
        return comment._id.toString();
    }
    async updateCommentService(id: string, dto: Omit<UpdateCommentDto, 'updatedAt'>): Promise<string> {
        const comment = await this.commentsRepository.findCommentOrNotFoundFailRepository(id);
        comment.update(dto);
        await this.commentsRepository.save(comment)
        return comment._id.toString();
    }
    async deleteCommentService(id: string) {
        const comment = await this.commentsRepository.findCommentOrNotFoundFailRepository(id);
        comment.makeDeleted();
        await this.commentsRepository.save(comment);
    }
}