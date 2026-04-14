import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetMerchandiseInfoQueryParams } from '../merchandise-Info-dto/get-merchandise-Info-query-params.input-dto';
import { MerchandiseInfoViewDto } from '../merchandise-Info-dto/merchandise-Info.view-dto';
import { MerchandiseInfo, MerchandiseInfoDocument, type MerchandiseInfoModelType } from '../merchandiseInfo-domain/merchandise-Info-entity';

@Injectable()
export class MerchandiseInfoQueryRepository {
    constructor(
        @InjectModel(MerchandiseInfo.name) private merchandiseInfoModel: MerchandiseInfoModelType
    ) { }

    async findMerchandiseInfoById(infoId: string): Promise<MerchandiseInfoDocument | null> {
        return this.merchandiseInfoModel.findOne({
            _id: new Types.ObjectId(infoId),
            deletedAt: null,
        });
    }

    async findMerchandiseInfoByIdOrNotFoundFailRepository(infoId: string): Promise<MerchandiseInfoViewDto> {
        let info
        if (!infoId || infoId === undefined || infoId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            info = await this.findMerchandiseInfoById(infoId);
        }
        if (!info) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return MerchandiseInfoViewDto.mapToView(info);
    }

    async getAllMerchandiseInfoQueryRepository(query: GetMerchandiseInfoQueryParams, userId?: string): Promise<PaginatedViewDto<MerchandiseInfoViewDto[]>> {
        // console.log('getAllPhotoAlbumsQueryRepository: query, userId 😡 ', query, userId)

        const normalizedQuery = GetMerchandiseInfoQueryParams.normalize(query);
        // console.log('getAllPhotoAlbumsQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<MerchandiseInfo> = {
            deletedAt: null,
        };

        if (userId) filter.userId = userId;

        // console.log('getAllPhotoAlbumsQueryRepository: base filter 😡 ', filter)

        if (normalizedQuery.searchMerchandiseInfo) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                albumName: { $regex: normalizedQuery.searchMerchandiseInfo, $options: 'i' },
            });
        }

        const info = await this.merchandiseInfoModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.merchandiseInfoModel.countDocuments(filter);

        const items = info.map(MerchandiseInfoViewDto.mapToView);

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