import { OmitType } from "@nestjs/swagger";
import { MerchandiseInfoDocument } from "../merchandiseInfo-domain/merchandise-Info-entity";

export class MerchandiseInfoViewDto {
    infoId: string;
    title: string;
    description: string | null;
    merchandiseId: string;
    createdAt: string;
    updatedAt: string;

    static mapToView(info: MerchandiseInfoDocument): MerchandiseInfoViewDto {
        // console.log('PhotoAlbumViewDto: mapToView - photoAlbum 😡 ', photoAlbum)
        const dto = new MerchandiseInfoViewDto();
        dto.infoId = info._id.toString();
        dto.title = info.title;
        dto.description = info.description;
        dto.merchandiseId = info.merchandiseId;
        dto.createdAt = info.createdAt;
        dto.updatedAt = info.updatedAt;
        // console.log('PhotoAlbumViewDto: mapToView - dto 😡 ', dto)
        return dto;
    }
}