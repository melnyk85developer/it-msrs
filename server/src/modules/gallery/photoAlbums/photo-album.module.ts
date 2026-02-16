import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotoAlbum, PhotoAlbumSchema } from './photo-album-domain/photo-album-entity';
import { PhotoAlbumRepository } from './photo-album-infrastructure/photo-album.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PhotoAlbum.name, schema: PhotoAlbumSchema }])
    ],
    providers: [PhotoAlbumRepository],
    exports: [PhotoAlbumRepository],
})
export class PhotoAlbumRepositoryModule { }
