import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { PhotoAlbumRepositoryModule } from './photoAlbums/photo-album.module';
import { PhotoAlbumController } from './photoAlbums/photo-album-api/photo-album.controller';
import { PhotoAlbumService } from './photoAlbums/photo-album-application/photo-album-service';
import { PhotoAlbumRepository } from './photoAlbums/photo-album-infrastructure/photo-album.repository';
import { PhotoAlbum, PhotoAlbumSchema } from './photoAlbums/photo-album-domain/photo-album-entity';
import { PhotoAlbumQueryRepository } from './photoAlbums/photo-album-infrastructure/photo-album.query-repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PhotoAlbum.name, schema: PhotoAlbumSchema }]),
        UserAccountsModule,
        PhotoAlbumRepositoryModule,
    ],
    controllers: [
        PhotoAlbumController
    ],
    providers: [
        PhotoAlbumService,
        PhotoAlbumRepository,
        PhotoAlbumQueryRepository
    ],
    exports: [
        PhotoAlbumService,
        PhotoAlbumRepository,
        PhotoAlbumQueryRepository
    ],
})
export class GalleryModule { }
