import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Basket, BasketDocument, type BasketModelType } from '../basket-domain/basket-entity';
import { BasketViewDto } from '../basket-dto/basket.view-dto';

@Injectable()
export class BasketRepository {
    constructor(
        @InjectModel(Basket.name) private basketModel: BasketModelType
    ) { }
    async save(basket: BasketDocument) {
        await basket.save();
    }
    async findBasketById(albumId: string): Promise<BasketDocument | null> {
        return this.basketModel.findOne({
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
        return this.basketModel.deleteOne({
            _id: new Types.ObjectId(basketId),
        });
    }
    async findBasketByUserId(userId: string): Promise<BasketDocument | null> {
        return this.basketModel.findOne({
            userId: userId,
            deletedAt: null,
        });
    }

    async findBasketByUserIdOrNotFoundFailRepository(userId: string): Promise<BasketViewDto> {
        let basket;
        console.log('BasketQueryRepository: - userId', userId)

        if (
            !userId || userId === 'undefined'
        ) {
            throw new DomainException(
                INTERNAL_STATUS_CODE.BAD_REQUEST,
                'basketId или userId сука говняные 😡😡😡'
            );
        } else {
            basket = await this.findBasketByUserId(userId);
        }
        console.log('BasketQueryRepository: - basket', basket)

        if (!basket) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        console.log('BasketQueryRepository: - basket', basket)

        return BasketViewDto.mapToView(basket);
    }
}