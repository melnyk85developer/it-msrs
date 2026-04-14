import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Basket, BasketDocument, type BasketModelType } from '../basket-domain/basket-entity';

@Injectable()
export class BasketRepository {
    constructor(
        @InjectModel(Basket.name) private basketModelType: BasketModelType
    ) { }
    async save(basket: BasketDocument) {
        await basket.save();
    }
    async findBasketById(albumId: string): Promise<BasketDocument | null> {
        return this.basketModelType.findOne({
            _id: new Types.ObjectId(albumId),
            deletedAt: null,
        });
    }
    async findBasketByIdOrNotFoundFailRepository(basketId: string): Promise<BasketDocument> {
        let basket
        if (!basketId || basketId === undefined || basketId === 'undefined') {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            basket = await this.findBasketById(basketId);
        }
        if (!basket) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return basket;
    }

    async deleteBasket(basketId: string): Promise<any> {
        return this.basketModelType.deleteOne({
            _id: new Types.ObjectId(basketId),
        });
    }
}