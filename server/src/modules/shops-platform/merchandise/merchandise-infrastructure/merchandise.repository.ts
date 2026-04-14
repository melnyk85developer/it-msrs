import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Merchandise, MerchandiseDocument, type MerchandiseModelType } from '../merchandise-domain/merchandise.entity';

@Injectable()
export class MerchandiseRepository {
    constructor(
        @InjectModel(Merchandise.name) private merchandiseModel: MerchandiseModelType
    ) { }
    async save(merchandise: MerchandiseDocument) {
        await merchandise.save();
    }
    async findMerchandiseById(merchandiseId: string): Promise<MerchandiseDocument | null> {
        return this.merchandiseModel.findOne({
            _id: new Types.ObjectId(merchandiseId),
            deletedAt: null,
        });
    }
    async findMerchandiseByIdOrNotFoundFailRepository(merchandiseId: string): Promise<MerchandiseDocument> {
        let merchandise
        if (!merchandiseId || merchandiseId === undefined || merchandiseId === 'undefined') {
            // console.log('MerchandiseRepository: findMerchandiseByIdOrNotFoundFailRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('MerchandiseRepository: findMerchandiseByIdOrNotFoundFailRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            merchandise = await this.findMerchandiseById(merchandiseId);
        }
        if (!merchandise) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return merchandise;
    }
    async findMerchandiseByName(userId: string, albumName: string): Promise<MerchandiseDocument | null> {
        return this.merchandiseModel.findOne({
            userId,
            albumName,
            deletedAt: null,
        });
    }
    async findMerchandiseByNameOrNotFoundFailRepository(userId: string, merchandiseName: string): Promise<MerchandiseDocument> {
        let merchandise
        if (!merchandiseName || merchandiseName === undefined || merchandiseName === 'undefined' || !userId || userId === undefined || userId === 'undefined') {
            console.log('MerchandiseRepository: findMerchandiseByNameOrNotFoundFailRepository - IF userId 😡😡😡 typeof', userId, typeof userId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            console.log('MerchandiseRepository: findMerchandiseByNameOrNotFoundFailRepository - ELSE userId 😡😡😡 typeof', userId, typeof userId)
            merchandise = await this.findMerchandiseByName(userId, merchandiseName);
            console.log('MerchandiseRepository: 😡😡😡', merchandise)
        }
        if (!merchandise) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return merchandise;
    }
    async deletePhotoAlbum(merchandiseId: string): Promise<any> {
        return this.merchandiseModel.deleteOne({
            _id: new Types.ObjectId(merchandiseId),
        });
    }
}