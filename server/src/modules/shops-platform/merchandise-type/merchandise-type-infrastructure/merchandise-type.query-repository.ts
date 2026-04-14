import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { MerchandiseType, MerchandiseTypeDocument, type MerchandiseTypeModelType } from '../merchandise-type-domain/merchandise-type-entity';
import { MerchandiseTypeViewDto } from '../merchandise-type-dto/merchandise-type.view-dto';
import { GetMerchandiseTypeQueryParams } from '../merchandise-type-dto/get-merchandise-type-query-params.input-dto';


@Injectable()
export class MerchandiseTypeQueryRepository {
    constructor(
        @InjectModel(MerchandiseType.name) private merchandiseTypeModel: MerchandiseTypeModelType
    ) { }

    async findMerchandiseTypeById(typeId: string): Promise<MerchandiseTypeDocument | null> {
        return this.merchandiseTypeModel.findOne({
            _id: new Types.ObjectId(typeId),
            deletedAt: null,
        });
    }

    async findMerchandiseTypeByIdOrNotFoundFailRepository(typeId: string): Promise<MerchandiseTypeViewDto> {
        let type
        if (!typeId || typeId === undefined || typeId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            type = await this.findMerchandiseTypeById(typeId);
        }
        if (!type) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return MerchandiseTypeViewDto.mapToView(type);
    }

    async getAllMerchandiseTypeQueryRepository(query: GetMerchandiseTypeQueryParams, userId?: string): Promise<PaginatedViewDto<MerchandiseTypeViewDto[]>> {
        // console.log('getAllPhotoAlbumsQueryRepository: query, userId 😡 ', query, userId)

        const normalizedQuery = GetMerchandiseTypeQueryParams.normalize(query);
        // console.log('getAllPhotoAlbumsQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<MerchandiseType> = {
            deletedAt: null,
        };

        if (userId) filter.userId = userId;

        // console.log('getAllPhotoAlbumsQueryRepository: base filter 😡 ', filter)

        if (normalizedQuery.searchMerchandiseType) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                albumName: { $regex: normalizedQuery.searchMerchandiseType, $options: 'i' },
            });
        }

        const type = await this.merchandiseTypeModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.merchandiseTypeModel.countDocuments(filter);

        const items = type.map(MerchandiseTypeViewDto.mapToView);

        // console.log('getAllPhotoAlbumsQueryRepository: RES items 😡 ', items)

        // items.reverse()

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }
}