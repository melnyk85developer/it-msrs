import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { MerchandiseBrand, MerchandiseBrandDocument, type MerchandiseBrandModelType } from '../merchandise-brand-domain/merchandise-brand.entity';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetMerchandiseBrandQueryParams } from '../merchandise-brand-dto/get-merchandise-brand-query-params.input-dto';
import { MerchandiseBrandViewDto } from '../merchandise-brand-dto/merchandise-brand.view-dto';

@Injectable()
export class MerchandiseBrandQueryRepository {
    constructor(
        @InjectModel(MerchandiseBrand.name) private merchandiseBrandModel: MerchandiseBrandModelType
    ) { }

    async findMerchandiseBrandById(brandId: string): Promise<MerchandiseBrandDocument | null> {
        return this.merchandiseBrandModel.findOne({
            _id: new Types.ObjectId(brandId),
            deletedAt: null,
        });
    }

    async findMerchandiseBrandByIdOrNotFoundFailRepository(brandId: string): Promise<MerchandiseBrandViewDto> {
        let brand
        if (!brandId || brandId === undefined || brandId === 'undefined') {
            // console.log('MerchandiseBrandQueryRepository: findMerchandiseBrandByIdOrNotFoundFailRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('MerchandiseBrandQueryRepository: findMerchandiseBrandByIdOrNotFoundFailRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            brand = await this.findMerchandiseBrandById(brandId);
        }
        if (!brand) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return MerchandiseBrandViewDto.mapToView(brand);
    }

    async getAllMerchandiseBrandQueryRepository(query: GetMerchandiseBrandQueryParams, userId?: string): Promise<PaginatedViewDto<MerchandiseBrandViewDto[]>> {
        // console.log('getAllPhotoAlbumsQueryRepository: query, userId 😡 ', query, userId)

        const normalizedQuery = GetMerchandiseBrandQueryParams.normalize(query);
        // console.log('getAllPhotoAlbumsQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<MerchandiseBrand> = {
            deletedAt: null,
        };

        if (userId) filter.userId = userId;

        // console.log('getAllPhotoAlbumsQueryRepository: base filter 😡 ', filter)

        if (normalizedQuery.searchMerchandiseBrand) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                merchandiseBrandName: { $regex: normalizedQuery.searchMerchandiseBrand, $options: 'i' },
            });
        }

        const brand = await this.merchandiseBrandModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.merchandiseBrandModel.countDocuments(filter);

        const items = brand.map(MerchandiseBrandViewDto.mapToView);

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