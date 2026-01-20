import { OmitType } from "@nestjs/swagger";
import { PhotoDocument } from "../photos-domain/photos-entity";

export class PhotoViewDto {
    photoId: string;
    image: string | null;
    miniature: string | null;
    albumId: string;
    albumName: string;
    userId: string;
    createdAt: string;
    updatedAt: string;

    static mapPhotoToView(photo: PhotoDocument): PhotoViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new PhotoViewDto();
        dto.photoId = photo._id.toString();
        dto.image = photo.image;
        dto.miniature = photo.miniature;
        dto.albumId = photo.albumId;
        dto.albumName = photo.albumName;
        dto.userId = photo.userId;
        dto.createdAt = photo.createdAt;
        dto.updatedAt = photo.updatedAt;
        // console.log('UsersController: mapToView - dto 😡 ', dto)
        return dto;
    }
}