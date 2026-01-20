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

    async findPhotoById(id: string): Promise<PhotoDocument | null> {
        return this.photoModel.findOne({
            _id: new Types.ObjectId(id),
            deletedAt: null,
        });
    }

    async save(photo: PhotoDocument) {
        await photo.save();
    }

    async findPhotoByIdOrNotFoundFailRepository(id: string): Promise<PhotoDocument> {
        let photo
        if (!id || id === undefined || id === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            photo = await this.findPhotoById(id);
        }
        if (!photo) {
            throw new DomainException(INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID);
        }
        return photo;
    }

    async deletePhoto(token: string): Promise<any> {
        return this.photoModel.deleteOne({
            token: token,
        });
    }
}