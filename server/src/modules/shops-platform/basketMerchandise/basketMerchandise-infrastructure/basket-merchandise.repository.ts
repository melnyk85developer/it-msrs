import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { BasketMerchandise, BasketMerchandiseDocument, type BasketMerchandiseModelType } from '../basketMerchandise-domain/basket-merchandise-entity';

@Injectable()
export class BasketMerchandiseRepository {
    constructor(
        @InjectModel(BasketMerchandise.name) private basketMerchandiseModel: BasketMerchandiseModelType
    ) { }
    async save(photoAlbum: BasketMerchandiseDocument) {
        await photoAlbum.save();
    }
    async findBasketMerchandiseById(albumId: string): Promise<BasketMerchandiseDocument | null> {
        return this.basketMerchandiseModel.findOne({
            _id: new Types.ObjectId(albumId),
            deletedAt: null,
        });
    }
    async findBasketMerchandiseByIdOrNotFoundFailRepository(albumId: string): Promise<BasketMerchandiseDocument> {
        let photoAlbum
        if (!albumId || albumId === undefined || albumId === 'undefined') {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            photoAlbum = await this.findBasketMerchandiseById(albumId);
        }
        if (!photoAlbum) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return photoAlbum;
    }
    async findBasketMerchandiseByName(userId: string, merchandiseName: string): Promise<BasketMerchandiseDocument | null> {
        return this.basketMerchandiseModel.findOne({
            userId,
            merchandiseName,
            deletedAt: null,
        });
    }
    async findBasketMerchandiseOrNotFoundFailRepository(userId: string, albumName: string): Promise<BasketMerchandiseDocument> {
        let photoAlbum
        if (!albumName || albumName === undefined || albumName === 'undefined' || !userId || userId === undefined || userId === 'undefined') {
            console.log('PhotoAlbumRepository: findPhotoAlbumByNameOrNotFoundFailRepository - IF userId 😡😡😡 typeof', userId, typeof userId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            console.log('PhotoAlbumRepository: findPhotoAlbumByNameOrNotFoundFailRepository - ELSE userId 😡😡😡 typeof', userId, typeof userId)
            photoAlbum = await this.findBasketMerchandiseByName(userId, albumName);
            console.log('PhotoAlbumRepository: 😡😡😡', photoAlbum)
        }
        if (!photoAlbum) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return photoAlbum;
    }
    async deleteBasketMerchandise(albumId: string): Promise<any> {
        return this.basketMerchandiseModel.deleteOne({
            _id: new Types.ObjectId(albumId),
        });
    }
}