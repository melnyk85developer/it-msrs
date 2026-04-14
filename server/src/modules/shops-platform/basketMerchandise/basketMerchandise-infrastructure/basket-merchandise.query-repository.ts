import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetBasketMerchandiseQueryParams } from '../basketMerchandise-dto/get-basket-merchandise-query-params.input-dto';
import { BasketMerchandiseViewDto } from '../basketMerchandise-dto/basket-merchandise.view-dto';
import { BasketMerchandise, BasketMerchandiseDocument, type BasketMerchandiseModelType } from '../basketMerchandise-domain/basket-merchandise-entity';

@Injectable()
export class BasketMerchandiseQueryRepository {
    constructor(
        @InjectModel(BasketMerchandise.name) private basketMerchandiseModel: BasketMerchandiseModelType
    ) { }

    async findBasketMerchandiseById(productId: string): Promise<BasketMerchandiseDocument | null> {
        return this.basketMerchandiseModel.findOne({
            _id: new Types.ObjectId(productId),
            deletedAt: null,
        });
    }

    async findBasketMerchandiseByIdOrNotFoundFailRepository(productId: string): Promise<BasketMerchandiseViewDto> {
        let product
        if (!productId || productId === undefined || productId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            product = await this.findBasketMerchandiseById(productId);
        }
        if (!product) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return BasketMerchandiseViewDto.mapToView(product);
    }

    async getAllBasketMerchandiseQueryRepository(query: GetBasketMerchandiseQueryParams, userId?: string): Promise<PaginatedViewDto<BasketMerchandiseViewDto[]>> {
        // console.log('getAllPhotoAlbumsQueryRepository: query, userId 😡 ', query, userId)

        const normalizedQuery = GetBasketMerchandiseQueryParams.normalize(query);
        // console.log('getAllPhotoAlbumsQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<BasketMerchandise> = {
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

        const photoAlbum = await this.basketMerchandiseModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.basketMerchandiseModel.countDocuments(filter);

        const items = photoAlbum.map(BasketMerchandiseViewDto.mapToView);

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