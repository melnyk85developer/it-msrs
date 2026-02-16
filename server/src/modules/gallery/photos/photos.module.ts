import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './photos-domain/photos-entity';
import { PhotoRepository } from './photos-infrastructure/photos-repository';
import { PhotoController } from './photos-api/photos.controller';
import { PhotoAlbumRepositoryModule } from '../photoAlbums/photo-album.module';
import { UserAccountsModule } from 'src/modules/user-accounts/user-accounts.module';
import { PhotoRepositoryModule } from './photos-repository.module';
import { PhotoQueryRepository } from './photos-infrastructure/photos.query-repository';
import { GalleryModule } from '../gallery.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePhotoUseCase } from './photos-application/photos-use-cases/create-photo.use-case';
import { UpdatePhotoUseCase } from './photos-application/photos-use-cases/update-photo.use-case';
import { DeletePhotoUseCase } from './photos-application/photos-use-cases/delete-photo.use-case';

const useCases = [
    CreatePhotoUseCase,
    UpdatePhotoUseCase,
    DeletePhotoUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
        CqrsModule,
        UserAccountsModule,
        PhotoAlbumRepositoryModule,
        PhotoRepositoryModule,
        GalleryModule
    ],
    controllers: [
        PhotoController
    ],
    providers: [
        ...useCases,
        PhotoRepository,
        PhotoQueryRepository,
    ],
    exports: [
        PhotoRepository,
    ],
})
export class PhotoModule { }
