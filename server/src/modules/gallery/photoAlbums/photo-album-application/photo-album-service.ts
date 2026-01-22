import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { InjectModel } from '@nestjs/mongoose';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PhotoAlbum, type PhotoAlbumModelType } from '../photo-album-domain/photo-album-entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { PhotoAlbumRepository } from '../photo-album-infrastructure/photo-album.repository';
import { CreateAlbumDto } from '../photo-album-dto/create-album-dto';
import { FilesService } from 'src/modules/files/files.service';
import { UpdatePhotoAlbumDto } from '../photo-album-dto/update-photo-album-dto';

@Injectable()
export class PhotoAlbumService {
    constructor(
        @InjectModel(PhotoAlbum.name) private photoAlbumModel: PhotoAlbumModelType,
        private photoAlbumRepository: PhotoAlbumRepository,
        private filesService: FilesService
    ) { }

    async createPhotoAlbumService(userId: string, albumCoverName: Multer.File, dto: Omit<CreateAlbumDto, 'userId'>): Promise<string> {
        console.log('PhotoAlbumService: createPhotoAlbumService - dto 😡 ', dto)
        let isAlbum
        let imageName

        if (albumCoverName) {
            imageName = await this.filesService.createPostFile(albumCoverName);
        }

        isAlbum = await this.getPhotoAlbumNameOrCreatedService(userId, dto.albumName, imageName)

        const photoAlbum = this.photoAlbumModel.createPhotoAlbumInstance(
            {
                albumName: isAlbum.albumName,
                albumCoverName: imageName ? imageName : null,
                userId
            }
        )
        // console.log('PhotoAlbumService: createPhotoAlbumService - photoAlbum 😡 save', photoAlbum)
        await this.photoAlbumRepository.save(photoAlbum);
        // console.log('PhotoAlbumService: createPhotoAlbumService - photoAlbum 😡 res', photoAlbum)
        return photoAlbum._id.toString();
    }

    async updatePhotoAlbumService(albumId: string, dto: Omit<UpdatePhotoAlbumDto, 'albumId'>, albumCoverFile: Multer.File): Promise<string> {
        let newImageFileName

        // console.log('PhotoAlbumService: updatePhotoAlbumService - albumId, dto 😡 ', albumId, dto)
        const photoAlbum = await this.photoAlbumRepository.findPhotoAlbumByIdOrNotFoundFailRepository(albumId);

        if (albumCoverFile) {
            newImageFileName = await this.filesService.createPostFile(albumCoverFile);
        }

        // console.log('PhotoAlbumService: updatePhotoAlbumService - newImageFileName 😡 ', newImageFileName)
        photoAlbum.updatePhotoAlbum({
            ...dto,
            albumId,
            albumCoverName: newImageFileName ? newImageFileName : dto.albumCoverName ? dto.albumCoverName : null
        });
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo1 😡 ', photo)
        await this.photoAlbumRepository.save(photoAlbum);
        // console.log('PhotoAlbumService: updatePhotoAlbumService - photo2 😡 ', photo)
        return photoAlbum._id.toString();
    }
    async deletePhotoAlbumService(albumId: string) {
        const photoAlbum = await this.photoAlbumRepository.findPhotoAlbumByIdOrNotFoundFailRepository(albumId);
        console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        const isDeletedPhoto = await this.photoAlbumRepository.deletePhotoAlbum(albumId);
        console.log('PhotoService: deletePhotoService - photoAlbum 😡 ', photoAlbum)
        // photoAlbum.makeDeletedPhotoAlbum();
        // await this.photoAlbumRepository.save(photoAlbum);
        return isDeletedPhoto._id
    }
    async getPhotoAlbumNameOrCreatedService(userId: string, albumName: string, imageName: string) {
        let isAlbumName
        let photoAlbum

        // console.log('PhotoAlbumService: getPhotoAlbumNameOrCreatedService - !defaultAlbum 😡 1', photoAlbum)

        if (albumName === 'defaultAlbum') {
            isAlbumName = await this.photoAlbumRepository.findPhotoAlbumByName(userId, 'defaultAlbum');
        } else {
            isAlbumName = await this.photoAlbumRepository.findPhotoAlbumByName(userId, albumName);
        }

        // console.log('PhotoAlbumService: getPhotoAlbumNameOrCreatedService - !defaultAlbum 😡 2', photoAlbum)

        if (!isAlbumName) {
            photoAlbum = this.photoAlbumModel.createPhotoAlbumInstance(
                {
                    albumName,
                    albumCoverName: imageName ? imageName : null,
                    userId
                }
            )
            await this.photoAlbumRepository.save(photoAlbum);

            // console.log('PhotoAlbumService: getPhotoAlbumNameOrCreatedService - photoAlbum 😡 3', photoAlbum)

            if (photoAlbum) {
                isAlbumName = await this.photoAlbumRepository.findPhotoAlbumById(photoAlbum._id);
                // console.log('PhotoAlbumService: getPhotoAlbumNameOrCreatedService - photoAlbum 😡 4', photoAlbum)
            }
        }
        console.log('PhotoAlbumService: getPhotoAlbumNameOrCreatedService - isAlbumName 😡 5', isAlbumName)
        return isAlbumName
    }
}
