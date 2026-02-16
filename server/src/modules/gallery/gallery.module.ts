import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { PhotoAlbumRepositoryModule } from './photoAlbums/photo-album.module';
import { PhotoAlbumController } from './photoAlbums/photo-album-api/photo-album.controller';
import { PhotoAlbumRepository } from './photoAlbums/photo-album-infrastructure/photo-album.repository';
import { PhotoAlbum, PhotoAlbumSchema } from './photoAlbums/photo-album-domain/photo-album-entity';
import { PhotoAlbumQueryRepository } from './photoAlbums/photo-album-infrastructure/photo-album.query-repository';
import { CreatePhotoAlbumUseCase } from './photoAlbums/photo-album-application/photo-album-use-cases/create-photo-album.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdatePhotoAlbumUseCase } from './photoAlbums/photo-album-application/photo-album-use-cases/update-photo-album.use-case';
import { DeletePhotoAlbumUseCase } from './photoAlbums/photo-album-application/photo-album-use-cases/delete-photo-album.use-case';
import { GetOrCreatePhotoAlbumUseCase } from './photoAlbums/photo-album-application/photo-album-use-cases/get-photo-album-or-create.use-case';

const useCases = [
    CreatePhotoAlbumUseCase,
    UpdatePhotoAlbumUseCase,
    DeletePhotoAlbumUseCase,
    GetOrCreatePhotoAlbumUseCase
]

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PhotoAlbum.name, schema: PhotoAlbumSchema }]),
        CqrsModule,
        UserAccountsModule,
        PhotoAlbumRepositoryModule,
    ],
    controllers: [
        PhotoAlbumController
    ],
    providers: [
        ...useCases,
        PhotoAlbumRepository,
        PhotoAlbumQueryRepository
    ],
    exports: [
        PhotoAlbumRepository,
        PhotoAlbumQueryRepository
    ],
})
export class GalleryModule { }
