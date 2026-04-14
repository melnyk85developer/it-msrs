import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { ShopTypeViewDto } from '../shop-type-dto/shop-type-view-dto';
import { GetShopTypeQueryParams } from '../shop-type-dto/get-shop-type-query-params.input-dto';
import { ShopType, ShopTypeDocument, type ShopTypeModelType } from '../shop-type-domain/shop-type-entity';

@Injectable()
export class ShopTypeQueryRepository {
    constructor(
        @InjectModel(ShopType.name) private shopTypeModel: ShopTypeModelType
    ) { }

    async getAllShopTypeQueryRepository(query: GetShopTypeQueryParams, userId: string): Promise<PaginatedViewDto<ShopTypeViewDto[]>> {

        const normalizedQuery = GetShopTypeQueryParams.normalize(query);
        // console.log('UsersQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<ShopType> = {
            deletedAt: null,
        };

        if (userId) filter.userId = userId;

        // console.log('UsersQueryRepository: base filter 😡 ', filter)

        if (normalizedQuery.searchShopTypeName) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                searchShopTypeName: { $regex: normalizedQuery.searchShopTypeName, $options: 'i' },
            });
        }
        const types = await this.shopTypeModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.shopTypeModel.countDocuments(filter);

        // const items = blogs.map(BlogViewDto.mapToBlogsView).reverse();
        const items = types.map(ShopTypeViewDto.mapShopTypeToView);

        // items.reverse()

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }

    async findShopTypeById(typeId: string): Promise<ShopTypeDocument | null> {
        return this.shopTypeModel.findOne({
            _id: new Types.ObjectId(typeId),
            deletedAt: null,
        });
    }

    async findShopTypeByIdOrNotFoundFailRepository(typeId: string): Promise<ShopTypeViewDto> {
        let type
        if (!typeId || typeId === undefined || typeId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            type = await this.findShopTypeById(typeId);
        }
        if (!type) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_PHOTO);
        }
        return ShopTypeViewDto.mapShopTypeToView(type);
    }
}