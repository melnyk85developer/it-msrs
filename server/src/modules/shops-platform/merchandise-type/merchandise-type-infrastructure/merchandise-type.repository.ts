import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { MerchandiseType, MerchandiseTypeDocument, type MerchandiseTypeModelType } from '../merchandise-type-domain/merchandise-type-entity';

@Injectable()
export class MerchandiseTypeRepository {
    constructor(
        @InjectModel(MerchandiseType.name) private merchandiseTypeModel: MerchandiseTypeModelType
    ) { }
    async save(type: MerchandiseTypeDocument) {
        await type.save();
    }
    async findMerchandiseTypeById(typeId: string): Promise<MerchandiseTypeDocument | null> {
        return this.merchandiseTypeModel.findOne({
            _id: new Types.ObjectId(typeId),
            deletedAt: null,
        });
    }
    async findMerchandiseTypeByIdOrNotFoundFailRepository(typeId: string): Promise<MerchandiseTypeDocument> {
        let merchandiseType
        if (!typeId || typeId === undefined || typeId === 'undefined') {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            merchandiseType = await this.findMerchandiseTypeById(typeId);
        }
        if (!merchandiseType) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return merchandiseType;
    }
    async findMerchandiseTypeByName(shopId: string, merchandiseTypeName: string): Promise<MerchandiseTypeDocument | null> {
        return this.merchandiseTypeModel.findOne({
            shopId,
            merchandiseTypeName,
            deletedAt: null,
        });
    }
    async findMerchandiseTypeByNameOrNotFoundFailRepository(shopId: string, merchandiseTypeName: string): Promise<MerchandiseTypeDocument> {
        let merchandiseType
        if (!merchandiseTypeName || merchandiseTypeName === undefined || merchandiseTypeName === 'undefined' || !shopId || shopId === undefined || shopId === 'undefined') {
            console.log('PhotoAlbumRepository: findPhotoAlbumByNameOrNotFoundFailRepository - IF userId 😡😡😡 typeof', shopId, typeof shopId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            console.log('PhotoAlbumRepository: findPhotoAlbumByNameOrNotFoundFailRepository - ELSE userId 😡😡😡 typeof', shopId, typeof shopId)
            merchandiseType = await this.findMerchandiseTypeByName(shopId, merchandiseType);
            console.log('PhotoAlbumRepository: 😡😡😡', merchandiseType)
        }
        if (!merchandiseType) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return merchandiseType;
    }
    async deleteMerchandiseType(typeId: string): Promise<any> {
        return this.merchandiseTypeModel.deleteOne({
            _id: new Types.ObjectId(typeId),
        });
    }
}