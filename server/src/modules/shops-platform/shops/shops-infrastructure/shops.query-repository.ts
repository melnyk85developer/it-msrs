import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { MyShops, MyShopsDocument, type MyShopsModelType } from '../shops-domain/shops-entity';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { MyShopsViewDto } from '../shops-dto/shops-view-dto';
import { GetMyShopsQueryParams } from '../shops-dto/get-shops-query-params.input-dto';

@Injectable()
export class MyShopsQueryRepository {
    constructor(
        @InjectModel(MyShops.name) private photoModel: MyShopsModelType
    ) { }

    async getAllMyShopsQueryRepository(query: GetMyShopsQueryParams, userId?: string): Promise<PaginatedViewDto<MyShopsViewDto[]>> {

        const normalizedQuery = GetMyShopsQueryParams.normalize(query);
        // console.log('UsersQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<MyShops> = {
            deletedAt: null,
        };

        if (userId) filter.userId = userId;

        // console.log('UsersQueryRepository: base filter 😡 ', filter)

        if (normalizedQuery.searchImage) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                searchImage: { $regex: normalizedQuery.searchImage, $options: 'i' },
            });
        }
        if (normalizedQuery.searchMiniature) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                searchMiniature: { $regex: normalizedQuery.searchMiniature, $options: 'i' },
            });
        }
        if (normalizedQuery.searchAlbumName) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                searchAlbumName: { $regex: normalizedQuery.searchAlbumName, $options: 'i' },
            });
        }
        const shops = await this.photoModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.photoModel.countDocuments(filter);

        // const items = blogs.map(BlogViewDto.mapToBlogsView).reverse();
        const items = shops.map(MyShopsViewDto.mapMyShopsToView);

        // items.reverse()

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }

    async findMyShopsById(shopId: string): Promise<MyShopsDocument | null> {
        return this.photoModel.findOne({
            _id: new Types.ObjectId(shopId),
            deletedAt: null,
        });
    }

    async findMyShopsByIdOrNotFoundFailRepository(shopId: string): Promise<MyShopsViewDto> {
        let shop
        if (!shopId || shopId === undefined || shopId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            shop = await this.findMyShopsById(shopId);
        }
        if (!shop) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_PHOTO);
        }
        return MyShopsViewDto.mapMyShopsToView(shop);
    }
}