import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ShopType, ShopTypeDocument, type ShopTypeModelType } from '../shop-type-domain/shop-type-entity';

@Injectable()
export class ShopTypeRepository {
    constructor(
        @InjectModel(ShopType.name) private shopTypeModel: ShopTypeModelType
    ) { }

    async findShopTypeById(photoId: string): Promise<ShopTypeDocument | null> {
        return this.shopTypeModel.findOne({
            _id: new Types.ObjectId(photoId),
            deletedAt: null,
        });
    }

    async save(photo: ShopTypeDocument) {
        await photo.save();
    }

    async findShopTypeByIdOrNotFoundFailRepository(photoId: string): Promise<ShopTypeDocument> {
        let photo
        if (!photoId || photoId === undefined || photoId === 'undefined') {
            // console.log('PhotoRepository: findPhotoByIdOrNotFoundFailRepository - IF photoId 😡😡😡 typeof', photoId, typeof photoId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PhotoRepository: findPhotoByIdOrNotFoundFailRepository - ELSE photoId 😡😡😡 typeof', photoId, typeof photoId)
            photo = await this.findShopTypeById(photoId);
        }
        if (!photo) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_PHOTO);
        }
        return photo;
    }

    async deleteShopType(photoId: string): Promise<any> {
        return this.shopTypeModel.deleteOne({
            _id: new Types.ObjectId(photoId)
        });
    }
}