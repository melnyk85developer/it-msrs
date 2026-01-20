import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PhotoAlbum, type PhotoAlbumModelType } from '../photo-album-domain/photo-album-entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { PhotoAlbumRepository } from '../photo-album-infrastructure/photo-album.repository';
import { CreateAlbumDto } from '../photo-album-dto/create-album-dto';

@Injectable()
export class PhotoAlbumService {
    constructor(
        @InjectModel(PhotoAlbum.name) private photoAlbumModel: PhotoAlbumModelType,
        private photoAlbumRepository: PhotoAlbumRepository
    ) { }

    async createPhotoAlbumService(userId: string, dto: CreateAlbumDto): Promise<string> {
        console.log('PhotoAlbumService: createPhotoAlbumService - dto 😡 ', dto)
        const photoAlbum = this.photoAlbumModel.createPhotoAlbumInstance(
            {
                ...dto,
                userId
            }
        )
        console.log('PhotoAlbumService: createPhotoAlbumService - photoAlbum 😡 ', photoAlbum)
        await this.photoAlbumRepository.save(photoAlbum);
        return photoAlbum._id.toString();
    }
}
