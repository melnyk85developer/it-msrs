import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { ShopBrandViewDto } from '../shop-brand-dto/shop-brand-view-dto';
import { GetShopBrandQueryParams } from '../shop-brand-dto/get-shop-brand-query-params.input-dto';
import { ShopBrand, ShopBrandDocument, type ShopTypeModelBrand } from '../shop-brand-domain/shop-brand-entity';

@Injectable()
export class ShopBrandQueryRepository {
    constructor(
        @InjectModel(ShopBrand.name) private shopBrandModel: ShopTypeModelBrand
    ) { }

    async getAllShopBrandQueryRepository(query: GetShopBrandQueryParams, userId: string): Promise<PaginatedViewDto<ShopBrandViewDto[]>> {

        const normalizedQuery = GetShopBrandQueryParams.normalize(query);
        // console.log('UsersQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<ShopBrand> = {
            deletedAt: null,
        };

        if (userId) filter.userId = userId;

        // console.log('UsersQueryRepository: base filter 😡 ', filter)

        if (normalizedQuery.searchShopBrandName) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                searchShopBrandName: { $regex: normalizedQuery.searchShopBrandName, $options: 'i' },
            });
        }
        const types = await this.shopBrandModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.shopBrandModel.countDocuments(filter);

        // const items = blogs.map(BlogViewDto.mapToBlogsView).reverse();
        const items = types.map(ShopBrandViewDto.mapShopBrandToView);

        // items.reverse()

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }

    async findShopBrandById(brandId: string): Promise<ShopBrandDocument | null> {
        // console.log('ShopTypeQueryRepository: findShopTypeById - typeId', typeId)

        return this.shopBrandModel.findOne({
            _id: new Types.ObjectId(brandId),
            deletedAt: null,
        });
    }

    async findShopBrandByIdOrNotFoundFailRepository(brandId: string): Promise<ShopBrandViewDto> {
        let brand
        if (!brandId || brandId === undefined || brandId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            brand = await this.findShopBrandById(brandId);
            // console.log('ShopTypeQueryRepository: findShopTypeByIdOrNotFoundFailRepository - typeId', typeId)
        }
        if (!brand) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_PHOTO);
        }
        return ShopBrandViewDto.mapShopBrandToView(brand);
    }
}