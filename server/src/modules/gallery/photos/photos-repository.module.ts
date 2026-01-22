import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Photo, PhotoSchema } from "./photos-domain/photos-entity";
import { PhotoRepository } from "./photos-infrastructure/photos-repository";


@Module({
    imports: [MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }])],
    providers: [PhotoRepository],
    exports: [PhotoRepository],
})
export class PhotoRepositoryModule { }
