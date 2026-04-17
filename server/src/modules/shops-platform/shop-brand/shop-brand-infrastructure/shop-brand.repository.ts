import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ShopBrand, ShopBrandDocument, type ShopTypeModelBrand } from '../shop-brand-domain/shop-brand-entity';

@Injectable()
export class ShopBrandRepository {
    constructor(
        @InjectModel(ShopBrand.name) private shopBrandModel: ShopTypeModelBrand
    ) { }

    async findShopBrandById(brandId: string): Promise<ShopBrandDocument | null> {
        return this.shopBrandModel.findOne({
            _id: new Types.ObjectId(brandId),
            deletedAt: null,
        });
    }

    async save(brand: ShopBrandDocument) {
        await brand.save();
    }

    async findShopBrandByIdOrNotFoundFailRepository(brandId: string): Promise<ShopBrandDocument> {
        let brand
        if (!brandId || brandId === undefined || brandId === 'undefined') {
            // console.log('PhotoRepository: findPhotoByIdOrNotFoundFailRepository - IF photoId 😡😡😡 typeof', photoId, typeof photoId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PhotoRepository: findPhotoByIdOrNotFoundFailRepository - ELSE photoId 😡😡😡 typeof', photoId, typeof photoId)
            brand = await this.findShopBrandById(brandId);
        }
        if (!brand) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_PHOTO);
        }
        return brand;
    }

    async deleteShopBrand(brandId: string): Promise<any> {
        return this.shopBrandModel.deleteOne({
            _id: new Types.ObjectId(brandId)
        });
    }
}