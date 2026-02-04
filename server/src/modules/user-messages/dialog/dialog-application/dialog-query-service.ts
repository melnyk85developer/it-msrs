import { Injectable } from '@nestjs/common';
import { Dialog, type DialogModelType } from '../dialog-domain/dialog-entity';
import { InjectModel } from '@nestjs/mongoose';
import { GetDialogsQueryParams } from '../../msg/msg-dto/msg-input-dto/get-all-dialogs-query-params.input-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { DialogsAllViewDto } from '../../msg/msg-api/viev-dto-msg/dialogs-all.view-dto';
import { DialogQueryRepository } from '../dialog-infrastructure/dialog-query.repository';
import { FilterQuery } from 'mongoose';
import { InterlocutorViewDto } from '../../msg/msg-api/viev-dto-msg/interlocutorViewDto';
import { UsersQueryRepository } from 'src/modules/user-accounts/users-infrastructure/users.query-repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { MessageQueryService } from '../../msg/msg-application/msg-query-service';
import { isDialogDeletedForUser, queryMaperArrUserMessages } from '../../msg/maper/queryMaper';

@Injectable()
export class DialogQueryService {
    constructor(
        @InjectModel(Dialog.name) private DialogModel: DialogModelType,
        private dialogQueryRepository: DialogQueryRepository,
        private usersQueryRepository: UsersQueryRepository,
        private messageQueryService: MessageQueryService
    ) { }

    async getAllInterlocutorsByUserIdQueryService(query: GetDialogsQueryParams, userId: string): Promise<PaginatedViewDto<InterlocutorViewDto[]>> {
        // console.log('DialogQueryService: _getAllDialogsForUserService - REQ userId', userId);
        let interlocutors: any = []
        let dialogs
        // console.log('DialogQueryService: getAllBlogRepository: query 😡 ', query)
        const normalizedQuery = GetDialogsQueryParams.normalize(query);
        // console.log('DialogQueryService: getAllBlogRepository: normalizedQuery 😡 ', normalizedQuery)
        const filter: FilterQuery<Dialog> = {
            deletedAt: null,
        };
        // console.log('DialogQueryService: getAllBlogRepository: filter 😡 ', filter)
        if (normalizedQuery.searchTextMessage) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                message: { $regex: normalizedQuery.searchTextMessage, $options: 'i' },
            });
        }
        // console.log('DialogQueryService: getAllBlogRepository: normalizedQuery 😡 PREV REQ', normalizedQuery)
        let isDialogs = await this.dialogQueryRepository.getAllDialogsByUserIdQueryRepository(normalizedQuery, filter)
        // console.log('DialogQueryService - RES isDialogs', isDialogs);
        if (isDialogs.length > 0) {
            for (let i = 0; isDialogs.length > i; i++) {
                if (isDialogs[i].userAId !== userId) {
                    const user = await this.usersQueryRepository.getProfileQueryRepository(isDialogs[i].userAId)
                    // console.log('DialogQueryService: user', user)
                    const msg = await this.messageQueryService.getAllMessagesByDialogIdService(
                        userId,
                        isDialogs[i].id
                    );
                    if (user && !isDialogDeletedForUser(isDialogs[i].meta, userId)) {
                        // console.log('DialogQueryService: isDialogDeletedForUser IF', isDialogDeletedForUser(isDialogs[i].meta, user.id.toString()))
                        // console.log('DialogQueryService - RES IF msg', msg);
                        // console.log('DialogQueryService - RES IF msg', msg.length && msg[msg.length - 1].message);
                        interlocutors.push({
                            userId: isDialogs[i].userAId,
                            name: user.name,
                            surname: user.surname,
                            avatar: user.avatar,
                            chat: isDialogs[i],
                            lastMessage: msg && msg.length ? msg[msg.length - 1] : ''
                        })
                    }
                } else {
                    const user = await this.usersQueryRepository.getProfileQueryRepository(isDialogs[i].userBId)
                    // console.log('DialogQueryService: user', user)
                    const msg = await this.messageQueryService.getAllMessagesByDialogIdService(
                        userId,
                        isDialogs[i].id
                    );
                    if (user && !isDialogDeletedForUser(isDialogs[i].meta, userId)) {
                        // console.log('DialogQueryService: isDialogDeletedForUser ELSE', isDialogDeletedForUser(isDialogs[i].meta, user.id.toString()))
                        // console.log('DialogQueryService - RES ELSE msg', msg.length && msg[msg.length - 1].message);
                        // console.log('DialogQueryService - RES user', user);
                        interlocutors.push({
                            userId: isDialogs[i].userBId,
                            name: user.name,
                            surname: user.surname,
                            avatar: user.avatar,
                            chat: isDialogs[i],
                            lastMessage: msg.length ? msg[msg.length - 1] : ''
                        })
                    }
                }
            }
            // console.log('DialogQueryService - RES isInterlocutors', interlocutors);
            dialogs = interlocutors
        } else {
            dialogs = isDialogs
        }

        const totalCount = await this.DialogModel.countDocuments(filter);
        // const items = blogs.map(BlogViewDto.mapToBlogsView).reverse();
        const items = dialogs.map(InterlocutorViewDto.mapToView);

        // const filtered = queryMaperArrUserMessages(items, userId)

        // items.reverse()
        // console.log('DialogQueryService - RES items', items);

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }
    async getDialogAndMSGQueryService(userId: string, dialogId: string, receiverId: string) {
        if (dialogId && receiverId) {
            const user = await this.usersQueryRepository.getProfileQueryRepository(receiverId)
            const isChat = await this.getDialogsByIdService(dialogId)
            const allMsgForDialogAndMiniUser = await this.messageQueryService.getAllMessagesByDialogIdService(
                userId,
                dialogId
            );
            // console.log('DialogQueryService: - isChat', isChat)
            // console.log('DialogQueryService: - user', user)
            // console.log('DialogQueryService: - allMsgForDialogAndMiniUser', allMsgForDialogAndMiniUser)
            return {
                allMsg: allMsgForDialogAndMiniUser,
                interlocutor: user,
                currentChat: isChat
            }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_INCORRECT_DATA_FOR_TO_GET_A_DIALOG)
        }
    }
    async _getOneDialogBySenderIdOrReceiverIdRepository(senderId: string, receiverId: string): Promise<Dialog | null> {
        const isDialog = await this.dialogQueryRepository.findOneDialogBySenderIdOrReceiverIdRepository(senderId, receiverId);
        return isDialog
    }
    async getDialogsByIdService(dialogId: string): Promise<DialogsAllViewDto> {
        const isDialog = await this.dialogQueryRepository.findDialogByIdOrNotFoundFailRepository(dialogId)
        return DialogsAllViewDto.mapToDialogsAllView(isDialog)
    }
}