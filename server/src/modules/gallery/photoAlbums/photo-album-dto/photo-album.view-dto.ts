import { OmitType } from "@nestjs/swagger";
import { PhotoAlbumDocument } from "../photo-album-domain/photo-album-entity";

export class PhotoAlbumViewDto {
    albumId: string;
    albumName: string;
    albumCoverName: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;

    static mapToView(photoAlbum: PhotoAlbumDocument): PhotoAlbumViewDto {
        // console.log('PhotoAlbumViewDto: mapToView - photoAlbum 😡 ', photoAlbum)
        const dto = new PhotoAlbumViewDto();
        dto.albumId = photoAlbum._id.toString();
        dto.albumName = photoAlbum.albumName;
        dto.albumCoverName = photoAlbum.albumCoverName;
        dto.userId = photoAlbum.userId;
        dto.createdAt = photoAlbum.createdAt;
        dto.updatedAt = photoAlbum.updatedAt;
        // console.log('PhotoAlbumViewDto: mapToView - dto 😡 ', dto)
        return dto;
    }
}