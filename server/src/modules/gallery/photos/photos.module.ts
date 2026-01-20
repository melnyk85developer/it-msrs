import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './photos-domain/photos-entity';
import { PhotoService } from './photos-application/photos-service';
import { PhotoRepository } from './photos-infrastructure/photos.repository';
import { PhotoController } from './photos-api/photos.controller';
import { PhotoAlbumRepositoryModule } from '../photoAlbums/photo-album.module';
import { UserAccountsModule } from 'src/modules/user.accounts/user-accounts.module';
import { PhotoRepositoryModule } from './photos-repository.module';
import { PhotoQueryRepository } from './photos-infrastructure/photos.query-repository';
import { GalleryModule } from '../gallery.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
        UserAccountsModule,
        PhotoAlbumRepositoryModule,
        PhotoRepositoryModule,
        GalleryModule
    ],
    controllers: [
        PhotoController
    ],
    providers: [
        PhotoService,
        PhotoRepository,
        PhotoQueryRepository,
    ],
    exports: [
        PhotoService,
        PhotoRepository,
    ],
})
export class PhotoModule { }
