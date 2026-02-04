import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../user-accounts/users-infrastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument, type SessionModelType } from '../sessions-domain/sessions.entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { GetSessionsQueryParams } from '../sessions-dto/get-sessions-query-params.input-dto';
import { FilterQuery } from 'mongoose';
import { SessionViewDto } from '../sessions-dto/sessions.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { UserViewDto } from 'src/modules/user-accounts/users-dto/users.view-dto';

@Injectable()
export class SessionQueryRepository {
    constructor(@InjectModel(Session.name) private SessionModel: SessionModelType) { }

    async findAllDeviceByUserId(filter: any, normalizedQuery: GetSessionsQueryParams): Promise<SessionDocument[] | null> {
        // console.log('SessionsRepository: filter 👽😡👽 ', filter)
        return await this.SessionModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);
    }

    async allDevicesOneUserQueryRepository(query: GetSessionsQueryParams, userId: string): Promise<PaginatedViewDto<SessionViewDto[]>> {
        const normalizedQuery = GetSessionsQueryParams.normalize(query);
        // console.log('allDevicesOneUserQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<Session> = {
            'userId': userId
        };
        // console.log('allDevicesOneUserQueryRepository: filter 😡 ', filter)
        if (normalizedQuery.browserName) {
            console.log('UsersQueryRepository: query.browserName 😡 ', normalizedQuery.browserName)
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: { $regex: normalizedQuery.browserName, $options: 'i' },
            });
        }
        if (normalizedQuery.browserVersion) {
            console.log('UsersQueryRepository: query.browserVersion 😡 ', normalizedQuery.browserVersion)
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: { $regex: normalizedQuery.browserVersion, $options: 'i' },
            });
        }
        if (normalizedQuery.osName) {
            console.log('UsersQueryRepository: query.osName 😡 ', normalizedQuery.osName)
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: { $regex: normalizedQuery.osName, $options: 'i' },
            });
        }
        if (normalizedQuery.osVersion) {
            console.log('UsersQueryRepository: query.osVersion 😡 ', normalizedQuery.osVersion)
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: { $regex: normalizedQuery.osVersion, $options: 'i' },
            });
        }
        if (normalizedQuery.device) {
            console.log('UsersQueryRepository: query.device 😡 ', normalizedQuery.device)
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: { $regex: normalizedQuery.device, $options: 'i' },
            });
        }
        if (normalizedQuery.country) {
            console.log('UsersQueryRepository: query.country 😡 ', normalizedQuery.country)
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: { $regex: normalizedQuery.country, $options: 'i' },
            });
        }
        if (normalizedQuery.city) {
            console.log('UsersQueryRepository: query.city 😡 ', normalizedQuery.city)
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: { $regex: normalizedQuery.city, $options: 'i' },
            });
        }
        // console.log('SessionsRepository: userId 👽😡👽 ', userId)
        const session = await this.findAllDeviceByUserId(filter, normalizedQuery);
        // console.log('SessionsRepository: session 👽😡👽 ', session)
        if (!session) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_SESSION_ID)
        }
        const totalCount = await this.SessionModel.countDocuments(filter);
        const items = session.map(SessionViewDto.mapToView);
        // console.log('UsersQueryRepository: items 😡 ', items)

        const res = PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
        // console.log('UsersQueryRepository: res 😡 ', res)
        return res
    }
}