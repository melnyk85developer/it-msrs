import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { MerchandiseBrand, MerchandiseBrandDocument, type MerchandiseBrandModelType } from '../merchandise-brand-domain/merchandise-brand.entity';

@Injectable()
export class MerchandiseBrandRepository {
    constructor(
        @InjectModel(MerchandiseBrand.name) private merchandiseBrandModel: MerchandiseBrandModelType
    ) { }
    async save(merchandiseBrand: MerchandiseBrandDocument) {
        await merchandiseBrand.save();
    }
    async findMerchandiseBrandById(brandId: string): Promise<MerchandiseBrandDocument | null> {
        return this.merchandiseBrandModel.findOne({
            _id: new Types.ObjectId(brandId),
            deletedAt: null,
        });
    }
    async findMerchandiseBrandByIdOrNotFoundFailRepository(brandId: string): Promise<MerchandiseBrandDocument> {
        let merchandiseBrand
        if (!brandId || brandId === undefined || brandId === 'undefined') {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            merchandiseBrand = await this.findMerchandiseBrandById(brandId);
        }
        if (!merchandiseBrand) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return merchandiseBrand;
    }
    async findMerchandiseBrandByName(userId: string, merchandiseBrandName: string): Promise<MerchandiseBrandDocument | null> {
        return this.merchandiseBrandModel.findOne({
            userId,
            merchandiseBrandName,
            deletedAt: null,
        });
    }
    async findMerchandiseBrandByNameOrNotFoundFailRepository(userId: string, merchandiseBrandName: string): Promise<MerchandiseBrandDocument> {
        let merchandiseBrand
        if (!merchandiseBrandName || merchandiseBrandName === undefined || merchandiseBrandName === 'undefined' || !userId || userId === undefined || userId === 'undefined') {
            console.log('PhotoAlbumRepository: findPhotoAlbumByNameOrNotFoundFailRepository - IF userId 😡😡😡 typeof', userId, typeof userId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            console.log('PhotoAlbumRepository: findPhotoAlbumByNameOrNotFoundFailRepository - ELSE userId 😡😡😡 typeof', userId, typeof userId)
            merchandiseBrand = await this.findMerchandiseBrandByName(userId, merchandiseBrandName);
            console.log('PhotoAlbumRepository: 😡😡😡', merchandiseBrand)
        }
        if (!merchandiseBrand) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return merchandiseBrand;
    }
    async deleteMerchandiseBrand(brandId: string): Promise<any> {
        return this.merchandiseBrandModel.deleteOne({
            _id: new Types.ObjectId(brandId),
        });
    }
}