import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { UserViewDto } from 'src/modules/user-accounts/users-dto/users.view-dto';
import { User } from 'src/modules/user-accounts/users-domain/user.entity';
import type { UserModelType } from 'src/modules/user-accounts/users-domain/user.entity';
import { GetUsersQueryParams } from 'src/modules/user-accounts/users-dto/get-users-query-params.input-dto';
import { UserProfileViewDto } from '../users-dto/user-profile.view-dto';

@Injectable()
export class UsersQueryRepository {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
    ) { }

    async getAllUsersQueryRepository(query: GetUsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {

        const normalizedQuery = GetUsersQueryParams.normalize(query);
        // console.log('UsersQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<User> = {
            deletedAt: null,
        };

        // console.log('UsersQueryRepository: base filter 😡 ', filter)

        const searchOrConditions: FilterQuery<User>[] = [];

        if (normalizedQuery.searchLoginTerm) {
            // console.log('UsersQueryRepository: searchLoginTerm 😡 ', normalizedQuery.searchLoginTerm)
            searchOrConditions.push({
                'accountData.login': {
                    $regex: normalizedQuery.searchLoginTerm,
                    $options: 'i',
                },
            });
        }

        if (normalizedQuery.searchEmailTerm) {
            // console.log('UsersQueryRepository: searchEmailTerm 😡 ', normalizedQuery.searchEmailTerm)
            searchOrConditions.push({
                'accountData.email': {
                    $regex: normalizedQuery.searchEmailTerm,
                    $options: 'i',
                },
            });
        }

        if (searchOrConditions.length > 0) {
            filter.$or = searchOrConditions;
        }

        // console.log('UsersQueryRepository: final filter 😡 ', filter)

        const sortFieldMap: Record<string, string> = {
            login: 'accountData.login',
            email: 'accountData.email',
            createdAt: 'createdAt',
        };

        const sortBy =
            sortFieldMap[normalizedQuery.sortBy] ?? 'createdAt';

        const users = await this.UserModel.find(filter)
            .sort({ [sortBy]: normalizedQuery.sortDirection })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        // console.log('UsersQueryRepository: users 😡 ', users)

        const totalCount = await this.UserModel.countDocuments(filter);
        // console.log('UsersQueryRepository: totalCount 😡 ', totalCount)

        const items = users.map(UserViewDto.mapToView);
        // console.log('UsersQueryRepository: items 😡 ', items)

        const res = PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });

        // console.log('UsersQueryRepository: res 😡 ', res)

        return res;
    }

    async getUserByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
        // console.log('UsersQueryRepository: getUserByIdOrNotFoundFail - id 😡 ', id)
        const user = await this.UserModel.findOne(
            {
                _id: id,
                deletedAt: null,
            }
        );
        // console.log('UsersQueryRepository: getUserByIdOrNotFoundFail - user 😡 ', user)
        if (!user) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        // console.log('UsersQueryRepository: getUserByIdOrNotFoundFail - user 😡 ', user)
        return UserViewDto.mapToView(user);
    }
    async getProfileQueryRepository(profileId: string): Promise<UserProfileViewDto> {
        // console.log('UsersQueryRepository: getProfileQueryRepository - profileId 😡 ', profileId)
        const profile = await this.UserModel.findOne(
            {
                _id: profileId,
                deletedAt: null,
            }
        );
        // console.log('UsersQueryRepository: getUserByIdOrNotFoundFail - user 😡 ', user)
        if (!profile) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        // console.log('UsersQueryRepository: getUserByIdOrNotFoundFail - profile 😡 ', profile)
        return UserProfileViewDto.mapToView(profile);

        // try {
        //     let profile = await this.usersQueryRepository.findOne({
        //         where: { userId },
        //         include: [
        //             { model: Post, include: [Like] },
        //             { model: Confirmation },
        //             { model: Role },
        //             { model: PhotoAlbum, include: [Photo] },
        //         ]
        //     })
        //     // Сортируем альбомы фото
        //     const sortedAlbums = [];
        //     for (const album of profile.photoAlbums) {
        //         const albumObject = {
        //             albumName: album.albumName,
        //             photos: album.photos
        //         };
        //         sortedAlbums.push(albumObject);
        //     }
        //     profile.photoAlbums = sortedAlbums

        //     await Promise.all(profile.posts.map(async (post) => {
        //         // Получаем автора поста по id
        //         const author = await this.getAuthorPostQueryRepository(post.postedByUserId);
        //         // Добавляем нужные поля
        //         const authorPost = { avatar: author.avatar, name: author.name, surname: author.surname }
        //         // Обновляем поля автора поста
        //         post.authorPost = authorPost
        //         // Добавляем лайки 
        //         post.likes = await post.$get('likes');
        //         return post;
        //     }))
        //     // Сортируем посты
        //     profile.posts.sort((post1, post2) => {
        //         // Проверяем, есть ли пины у постов
        //         const hasPin1 = post1.pin !== false;
        //         const hasPin2 = post2.pin !== false;

        //         // Получаем даты создания постов в виде объектов Date
        //         const date1 = new Date(post1.createdAt);
        //         const date2 = new Date(post2.createdAt);

        //         // Если у обоих постов есть пины
        //         if (hasPin1 && hasPin2) {
        //             // Сначала сортируем по пину
        //             if (post1.pin !== post2.pin) {
        //                 return post1.pin ? -1 : 1; // Если pin у первого поста true, он идет первым
        //             } else {
        //                 // Если пины одинаковые, сортируем по дате создания
        //                 return date1.getTime() - date2.getTime(); // Изменяем порядок сортировки на прямой
        //             }
        //         } else if (hasPin1) {
        //             // Если пин только у первого поста
        //             return -1; // Первый пост с пином идет первым
        //         } else if (hasPin2) {
        //             // Если пин только у второго поста
        //             return 1; // Второй пост с пином идет первым
        //         } else {
        //             // Если у обоих постов нет пина, сортируем по дате создания
        //             return date1.getTime() - date2.getTime(); // Изменяем порядок сортировки на прямой
        //         }
        //     });
        //     return profile;
        // } catch (error) {
        //     return null
        //     // throw new ErRes(-100, `Ошибка базы данных при получении пользователя - getProfileQueryRepository: ${error}`, error)
        // }
    }
}