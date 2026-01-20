import { OmitType } from "@nestjs/swagger";
import { PhotoAlbumDocument } from "../photo-album-domain/photo-album-entity";

export class PhotoAlbumViewDto {
    id: string;
    albumName: string;
    userId: string;
    createdAt: string;
    updatedAt: string;

    static mapToView(photoAlbum: PhotoAlbumDocument): PhotoAlbumViewDto {
        // console.log('PhotoAlbumViewDto: mapToView - photoAlbum 😡 ', photoAlbum)
        const dto = new PhotoAlbumViewDto();
        dto.id = photoAlbum._id.toString();
        dto.albumName = photoAlbum.albumName;
        dto.userId = photoAlbum.userId;
        dto.createdAt = photoAlbum.createdAt;
        dto.updatedAt = photoAlbum.updatedAt;
        console.log('PhotoAlbumViewDto: mapToView - dto 😡 ', dto)
        return dto;
    }
}