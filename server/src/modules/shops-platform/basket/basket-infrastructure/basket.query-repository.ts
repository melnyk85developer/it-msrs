import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Basket, BasketDocument, type BasketModelType } from '../basket-domain/basket-entity';
import { BasketViewDto } from '../basket-dto/basket.view-dto';

@Injectable()
export class BasketQueryRepository {
    constructor(
        @InjectModel(Basket.name) private basketModel: BasketModelType
    ) { }

    async findBasketById(basketId: string): Promise<BasketDocument | null> {
        return this.basketModel.findOne({
            _id: new Types.ObjectId(basketId),
            deletedAt: null,
        });
    }

    async findBasketByIdOrNotFoundFailRepository(basketId: string): Promise<BasketViewDto> {
        let basket
        if (!basketId || basketId === undefined || basketId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            basket = await this.findBasketById(basketId);
        }
        if (!basket) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return BasketViewDto.mapToView(basket);
    }
    async findBasketByIdAndUserId(userId: string, basketId: string): Promise<BasketDocument | null> {
        return this.basketModel.findOne({
            _id: new Types.ObjectId(basketId),
            userId: new Types.ObjectId(userId),
            deletedAt: null,
        });
    }

    async findBasketByIdAndUserIdOrNotFoundFailRepository(userId: string, basketId: string): Promise<BasketViewDto> {
        let basket;

        if (
            !basketId || basketId === 'undefined' ||
            !userId || userId === 'undefined'
        ) {
            throw new DomainException(
                INTERNAL_STATUS_CODE.BAD_REQUEST,
                'basketId или userId сука говняные 😡😡😡'
            );
        } else {
            basket = await this.findBasketByIdAndUserId(userId, basketId);
        }

        if (!basket) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }

        return BasketViewDto.mapToView(basket);
    }
    async findBasketByUserI(userId: string): Promise<BasketDocument | null> {
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
            basket = await this.findBasketByUserI(userId);
        }
        console.log('BasketQueryRepository: - basket', basket)

        if (!basket) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        console.log('BasketQueryRepository: - basket', basket)

        return BasketViewDto.mapToView(basket);
    }
}