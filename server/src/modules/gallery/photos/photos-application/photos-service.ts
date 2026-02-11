import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Multer } from 'multer';
import { Photo, type PhotoModelType } from '../photos-domain/photos-entity';
import { PhotoRepository } from '../photos-infrastructure/photos-repository';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { UpdatePhotoDto } from '../photos-dto/update-photo-dto';
import { CreatePhotoDto } from '../photos-dto/create-photo-dto';
import { FilesService } from 'src/modules/files/files.service';
import { PhotoAlbumRepository } from '../../photoAlbums/photo-album-infrastructure/photo-album.repository';
import { PhotoAlbumService } from '../../photoAlbums/photo-album-application/photo-album-service';

@Injectable()
export class PhotoService {
    constructor(
        @InjectModel(Photo.name) private photoModel: PhotoModelType,
        private photoRepository: PhotoRepository,
        private photoAlbumService: PhotoAlbumService,
        private photoAlbumRepository: PhotoAlbumRepository,
        private filesService: FilesService
    ) { }

    async createPhotoService(userId: string, dto: CreatePhotoDto, image: Multer.File, miniature: Multer.File): Promise<string> {
        // console.log('createPhotoService - userId 😡 1', userId)
        // console.log('createPhotoService - dto 😡 2', dto.albumName)
        let isAlbum

        const imageName = await this.filesService.createPostFile(image);
        const miniatureName = await this.filesService.createPostFile(miniature);
        // console.log('createPhotoService - imageName 😡 3', imageName)
        // console.log('createPhotoService - miniatureName 😡 4', miniatureName)

        isAlbum = await this.photoAlbumService.getPhotoAlbumNameOrCreatedService(userId, dto.albumName, miniatureName)

        // console.log('PhotoAlbumService: IS createPhotoAlbumService - isAlbum 😡 10', isAlbum)

        const photo = this.photoModel.createPhotoInstance({
            ...dto,
            image: imageName,
            miniature: miniatureName,
            albumName: isAlbum.albumName,
            albumId: isAlbum._id,
            userId: userId
        });
        // console.log('PhotoAlbumService: IS createPhotoInstance - photo 😡 11', photo)
        await this.photoRepository.save(photo);
        // console.log('PhotoAlbumService: IS createPhotoAlbumService - isAlbum 😡 12', photo)
        return photo._id.toString();
    }
    async updatePhotoService(photoId: string, dto: UpdatePhotoDto, image: Multer.File, miniature: Multer.File): Promise<string> {
        let isAlbum
        let newImageFileName
        let newMiniatureFileName

        // console.log('PhotoService: updatePhotoService - photoId, dto 😡 ', photoId, dto)
        const photo = await this.photoRepository.findPhotoByIdOrNotFoundFailRepository(photoId);

        if (image && miniature) {
            newImageFileName = await this.filesService.createPostFile(image);
            newMiniatureFileName = await this.filesService.createPostFile(miniature);
        }

        isAlbum = await this.photoAlbumService.getPhotoAlbumNameOrCreatedService(dto.userId, dto.albumName, dto.miniatureName)

        // console.log('PhotoService: updatePhotoService - newImageFileName 😡 ', newImageFileName)
        // console.log('PhotoService: updatePhotoService - newImageFileName 😡 ', newImageFileName)

        photo.updatePhoto({
            photoId,
            userId: dto.userId,
            albumId: isAlbum.albumId,
            albumName: isAlbum.albumName,
            image: newImageFileName ? newImageFileName : dto.imageName,
            miniature: newMiniatureFileName ? newMiniatureFileName : dto.miniatureName
        });
        // console.log('PhotoService: updatePhotoService - photo1 😡 ', photo)
        await this.photoRepository.save(photo);
        // console.log('PhotoService: updatePhotoService - photo2 😡 ', photo)
        return photo._id.toString();
    }
    async deletePhotoService(photoId: string) {
        const photo = await this.photoRepository.findPhotoByIdOrNotFoundFailRepository(photoId);
        // console.log('PhotoService: deletePhotoService - photo 😡 ', photo)
        // const isDeletedPhoto = await this.photoRepository.deletePhoto(photoId);

        photo.makeDeletedPhoto();
        await this.photoRepository.save(photo);
    }
}
