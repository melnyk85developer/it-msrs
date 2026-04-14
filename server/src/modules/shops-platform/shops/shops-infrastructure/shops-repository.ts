import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { MyShops, MyShopsDocument, type MyShopsModelType } from '../shops-domain/shops-entity';

@Injectable()
export class MyShopsRepository {
    constructor(
        @InjectModel(MyShops.name) private myShopsModel: MyShopsModelType
    ) { }

    async findMyShopsById(shopId: string): Promise<MyShopsDocument | null> {
        return this.myShopsModel.findOne({
            _id: new Types.ObjectId(shopId),
            deletedAt: null,
        });
    }

    async save(shop: MyShopsDocument) {
        await shop.save();
    }

    async findMyShopsByIdOrNotFoundFailRepository(shopId: string): Promise<MyShopsDocument> {
        let shop
        if (!shopId || shopId === undefined || shopId === 'undefined') {
            // console.log('PhotoRepository: findPhotoByIdOrNotFoundFailRepository - IF photoId 😡😡😡 typeof', photoId, typeof photoId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PhotoRepository: findPhotoByIdOrNotFoundFailRepository - ELSE photoId 😡😡😡 typeof', photoId, typeof photoId)
            shop = await this.findMyShopsById(shopId);
        }
        if (!shop) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_PHOTO);
        }
        return shop;
    }

    async deleteMyShops(shopId: string): Promise<any> {
        return this.myShopsModel.deleteOne({
            _id: new Types.ObjectId(shopId)
        });
    }
}