import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { UserViewDto } from 'src/modules/user.accounts/users-dto/users.view-dto';
import { User } from 'src/modules/user.accounts/users-domain/user.entity';
import type { UserModelType } from 'src/modules/user.accounts/users-domain/user.entity';
import { GetUsersQueryParams } from 'src/modules/user.accounts/users-dto/get-users-query-params.input-dto';

@Injectable()
export class UsersQueryRepository {
    constructor(
        @InjectModel(User.name)
        private UserModel: UserModelType,
    ) { }
    async getAllUsersQueryRepository(query: GetUsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {

        const normalizedQuery = GetUsersQueryParams.normalize(query);

        // console.log('UsersQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<User> = {
            'accountData.deletedAt': null,
        };
        // console.log('UsersQueryRepository: filter 😡 ', filter)

        if (normalizedQuery.searchLoginTerm) {
            // console.log('UsersQueryRepository: query.searchLoginTerm 😡 ', normalizedQuery.searchLoginTerm)
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: { $regex: normalizedQuery.searchLoginTerm, $options: 'i' },
            });
        }

        if (normalizedQuery.searchEmailTerm) {
            // console.log('UsersQueryRepository: query.searchEmailTerm 😡 ', normalizedQuery.searchEmailTerm)
            filter.$or = filter.$or || [];
            filter.$or.push({
                email: { $regex: normalizedQuery.searchEmailTerm, $options: 'i' },
            });
        }

        const users = await this.UserModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        // console.log('UsersQueryRepository: users 😡 ', users)

        const totalCount = await this.UserModel.countDocuments(filter);
        // console.log('UsersController: totalCount 😡 ', totalCount)

        const items = users.map(UserViewDto.mapToView);
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
    async getUserByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
        // console.log('UsersQueryRepository: getUserByIdOrNotFoundFail - id 😡 ', id)
        const user = await this.UserModel.findOne(
            {
                _id: id,
                $or: [{ 'accountData.deletedAt': null }]
            }
        );
        // console.log('UsersQueryRepository: getUserByIdOrNotFoundFail - user 😡 ', user)
        if (!user) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        // console.log('UsersQueryRepository: getUserByIdOrNotFoundFail - user 😡 ', user)
        return UserViewDto.mapToView(user);
    }
}