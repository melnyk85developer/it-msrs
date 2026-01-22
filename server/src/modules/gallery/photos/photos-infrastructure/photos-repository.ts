import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Photo, PhotoDocument, type PhotoModelType } from '../photos-domain/photos-entity';

@Injectable()
export class PhotoRepository {
    constructor(
        @InjectModel(Photo.name) private photoModel: PhotoModelType
    ) { }

    async findPhotoById(photoId: string): Promise<PhotoDocument | null> {
        return this.photoModel.findOne({
            _id: new Types.ObjectId(photoId),
            deletedAt: null,
        });
    }

    async save(photo: PhotoDocument) {
        await photo.save();
    }

    async findPhotoByIdOrNotFoundFailRepository(photoId: string): Promise<PhotoDocument> {
        let photo
        if (!photoId || photoId === undefined || photoId === 'undefined') {
            // console.log('PhotoRepository: findPhotoByIdOrNotFoundFailRepository - IF photoId 😡😡😡 typeof', photoId, typeof photoId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PhotoRepository: findPhotoByIdOrNotFoundFailRepository - ELSE photoId 😡😡😡 typeof', photoId, typeof photoId)
            photo = await this.findPhotoById(photoId);
        }
        if (!photo) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_PHOTO);
        }
        return photo;
    }

    async deletePhoto(photoId: string): Promise<any> {
        return this.photoModel.deleteOne({
            _id: new Types.ObjectId(photoId)
        });
    }
}