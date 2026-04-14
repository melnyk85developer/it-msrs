import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetMerchandiseQueryParams } from '../merchandise-dto/get-merchandise-query-params.input-dto';
import { Merchandise, MerchandiseDocument, type MerchandiseModelType } from '../merchandise-domain/merchandise.entity';
import { MerchandiseViewDto } from '../merchandise-dto/merchandise.view-dto';

@Injectable()
export class MerchandiseQueryRepository {
    constructor(
        @InjectModel(Merchandise.name) private merchandiseModel: MerchandiseModelType
    ) { }

    async findMerchandiseById(merchandiseId: string): Promise<MerchandiseDocument | null> {
        return this.merchandiseModel.findOne({
            _id: new Types.ObjectId(merchandiseId),
            deletedAt: null,
        });
    }

    async findMerchandiseByIdOrNotFoundFailRepository(merchandiseId: string): Promise<MerchandiseViewDto> {
        let merchandise
        if (!merchandiseId || merchandiseId === undefined || merchandiseId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            merchandise = await this.findMerchandiseById(merchandiseId);
        }
        if (!merchandise) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return MerchandiseViewDto.mapToView(merchandise);
    }

    async getAllMerchandiseQueryRepository(query: GetMerchandiseQueryParams, userId?: string): Promise<PaginatedViewDto<MerchandiseViewDto[]>> {
        // console.log('getAllPhotoAlbumsQueryRepository: query, userId 😡 ', query, userId)

        const normalizedQuery = GetMerchandiseQueryParams.normalize(query);
        // console.log('getAllPhotoAlbumsQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<Merchandise> = {
            deletedAt: null,
        };

        if (userId) filter.userId = userId;

        // console.log('getAllPhotoAlbumsQueryRepository: base filter 😡 ', filter)

        if (normalizedQuery.searchName) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                albumName: { $regex: normalizedQuery.searchName, $options: 'i' },
            });
        }

        const merchandise = await this.merchandiseModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.merchandiseModel.countDocuments(filter);

        const items = merchandise.map(MerchandiseViewDto.mapToView);

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