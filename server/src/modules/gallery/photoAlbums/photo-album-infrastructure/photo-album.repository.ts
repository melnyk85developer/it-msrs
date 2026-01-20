import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PhotoAlbum, PhotoAlbumDocument, type PhotoAlbumModelType } from '../photo-album-domain/photo-album-entity';

@Injectable()
export class PhotoAlbumRepository {
    constructor(
        @InjectModel(PhotoAlbum.name) private photoAlbumModel: PhotoAlbumModelType
    ) { }
    async save(photoAlbum: PhotoAlbumDocument) {
        await photoAlbum.save();
    }
    async findPhotoAlbumById(albumId: string): Promise<PhotoAlbumDocument | null> {
        return this.photoAlbumModel.findOne({
            _id: new Types.ObjectId(albumId),
            deletedAt: null,
        });
    }
    async findPhotoAlbumByIdOrNotFoundFailRepository(albumId: string): Promise<PhotoAlbumDocument> {
        let photoAlbum
        if (!albumId || albumId === undefined || albumId === 'undefined') {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            photoAlbum = await this.findPhotoAlbumById(albumId);
        }
        if (!photoAlbum) {
            throw new DomainException(INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID);
        }
        return photoAlbum;
    }
    async findPhotoAlbumByName(userId: string, albumName: string): Promise<PhotoAlbumDocument | null> {
        return this.photoAlbumModel.findOne({
            userId,
            albumName,
            deletedAt: null,
        });
    }
    async findPhotoAlbumByNameOrNotFoundFailRepository(userId: string, albumName: string): Promise<PhotoAlbumDocument> {
        let photoAlbum
        if (!albumName || albumName === undefined || albumName === 'undefined' || !userId || userId === undefined || userId === 'undefined') {
            console.log('PhotoAlbumRepository: findPhotoAlbumByNameOrNotFoundFailRepository - IF userId 😡😡😡 typeof', userId, typeof userId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            console.log('PhotoAlbumRepository: findPhotoAlbumByNameOrNotFoundFailRepository - ELSE userId 😡😡😡 typeof', userId, typeof userId)
            photoAlbum = await this.findPhotoAlbumByName(userId, albumName);
            console.log('PhotoAlbumRepository: 😡😡😡', photoAlbum)
        }
        if (!photoAlbum) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return photoAlbum;
    }
    async deletePhotoAlbum(albumId: string): Promise<any> {
        return this.photoAlbumModel.deleteOne({
            albumId: albumId,
        });
    }
}