import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Multer } from 'multer';
import { Photo, type PhotoModelType } from '../photos-domain/photos-entity';
import { PhotoRepository } from '../photos-infrastructure/photos.repository';
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

        const imageName = await this.filesService.createPostFile(image);
        const miniatureName = await this.filesService.createPostFile(miniature);
        console.log('createPhotoService - imageName 😡 3', imageName)
        console.log('createPhotoService - miniatureName 😡 4', miniatureName)

        let isAlbum
        if (!dto.albumId && !dto.albumName) {
            // console.log('createPhotoService - !dto.albumId || !dto.albumName 😡 5')
            isAlbum = await this.photoAlbumRepository.findPhotoAlbumByName(userId, 'defaultAlbum')
            // console.log('createPhotoService - isAlbum 😡 4', isAlbum)
            if (!isAlbum) {
                const defaultAlbumDto = {
                    albumName: 'defaultAlbum',
                    userId
                }
                const albumId = await this.photoAlbumService.createPhotoAlbumService(userId, defaultAlbumDto)
                // console.log('PhotoAlbumService: IS createPhotoAlbumService - albumId 😡 6', albumId)
                isAlbum = await this.photoAlbumRepository.findPhotoAlbumByIdOrNotFoundFailRepository(albumId)
                // console.log('PhotoAlbumService: IS createPhotoAlbumService - isAlbum 😡 7', isAlbum)
            }
        } else {
            if (dto.albumId) {
                isAlbum = await this.photoAlbumRepository.findPhotoAlbumById(dto.albumId)
            }
            if (!isAlbum) {
                isAlbum = await this.photoAlbumRepository.findPhotoAlbumByName(userId, dto.albumName)
            }
            if (!isAlbum) {
                const defaultAlbumDto = {
                    albumName: 'defaultAlbum',
                    userId
                }
                const albumId = await this.photoAlbumService.createPhotoAlbumService(userId, defaultAlbumDto)
                // console.log('PhotoAlbumService: IS createPhotoAlbumService - albumId 😡 6', albumId)
                isAlbum = await this.photoAlbumRepository.findPhotoAlbumByIdOrNotFoundFailRepository(albumId)
                // console.log('PhotoAlbumService: IS createPhotoAlbumService - isAlbum 😡 7', isAlbum)
            }
        }
        // console.log('PhotoAlbumService: IS createPhotoAlbumService - isAlbum 😡 8', isAlbum)

        const photo = this.photoModel.createPhotoInstance({
            ...dto,
            image: imageName,
            miniature: miniatureName,
            albumName: isAlbum.albumName,
            albumId: isAlbum._id,
            userId: userId
        });
        // console.log('PhotoAlbumService: IS createPhotoInstance - photo 😡 9', photo)
        await this.photoRepository.save(photo);
        // console.log('PhotoAlbumService: IS createPhotoAlbumService - isAlbum 😡 10', photo)
        return photo._id.toString();
    }
    async updatePhotoService(photoId: string, dto: UpdatePhotoDto, image: Multer.File, miniature: Multer.File): Promise<string> {
        console.log('UsersService: updateUserService - photoId, dto 😡 ', photoId, dto)
        const photo = await this.photoRepository.findPhotoByIdOrNotFoundFailRepository(photoId);
        const imageName = await this.filesService.createPostFile(image);
        const miniatureName = await this.filesService.createPostFile(miniature);

        console.log('UsersService: updateUserService - imageName 😡 ', imageName)
        console.log('UsersService: updateUserService - miniatureName 😡 ', miniatureName)

        photo.updatePhoto({
            ...dto,
            image: imageName,
            miniature: miniatureName
        });
        // console.log('UsersService: updateUserService - user2 😡 ', user)
        await this.photoRepository.save(photo);
        // console.log('UsersService: updateUserService - user3 😡 ', user)
        return photo._id.toString();
    }
    async deletePhotoService(photoId: string) {
        const user = await this.photoRepository.deletePhoto(photoId);
        // console.log('UsersService: deleteUserService - user 😡 ', user)
        user.makeDeletedAccount();
        await this.photoAlbumRepository.save(user);
    }
}
