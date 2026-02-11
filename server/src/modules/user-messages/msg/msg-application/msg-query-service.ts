import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Message, type MessageModelType } from '../msg-domain/msg-entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { MessageRepository } from '../msg-infrastructure/msg.repository';
import { CreateMessageDto } from '../msg-dto/create-msg.dto';
import { DialogService } from '../../dialog/dialog-application/dialog-service';
import { Multer } from 'multer';
import { MessageOneViewDto } from '../msg-api/viev-dto-msg/msg-one.view-dto';
import { UpdateMessageDto } from '../msg-dto/update-msg.dto';
import { UpdateMessageReadDomainDto } from '../msg-dto/update-msg-read-domain.dto';
import { MessagesAllViewDto } from '../msg-api/viev-dto-msg/msg-all.view-dto';
import { MessageQueryRepository } from '../msg-infrastructure/msg-query.repository';
import { queryMaperArrUserMessages, queryMaperUserMessage } from '../maper/queryMaper';

@Injectable()
export class MessageQueryService {
    constructor(
        // @InjectModel(Message.name) private MessageModel: MessageModelType,
        private messageQueryRepository: MessageQueryRepository,
        private dialogsService: DialogService,
    ) { }
    async getAllMessagesByDialogIdService(userId: string, dialogId: string): Promise<MessagesAllViewDto[]> {
        const messages = await this.messageQueryRepository.findMessagesByDialogIdOrNotFoundFailRepository(dialogId);
        // console.log('DialogQueryService - RES getAllMessagesByDialogIdService messages', messages);
        if (messages.length) {
            return queryMaperArrUserMessages(messages, userId).map(MessagesAllViewDto.mapToMessagesAllView)
        } else {
            return []
        }
    }
    async getMessageByIdOrNotFoundFailQueryService(msgId: string, userId: string): Promise<MessagesAllViewDto> {
        const message = await this.messageQueryRepository.findMessageByIdOrNotFoundFailRepository(msgId);
        // console.log('MessageQueryService - RES getAllMessagesByDialogIdService message', message);
        const filtered = queryMaperUserMessage(message, userId);
        // console.log('MessageQueryService - RES getAllMessagesByDialogIdService filtered', filtered);
        if (!filtered) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_MESSAGE);
        }
        return MessagesAllViewDto.mapToMessagesAllView(filtered);
    }
    async _getMessage(msgId: string): Promise<Message | null> {
        return await this.messageQueryRepository.findMessageByIdOrNotFoundFailRepository(msgId);
    }
}
