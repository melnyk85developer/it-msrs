import { OmitType } from "@nestjs/swagger";
import { MerchandiseTypeDocument } from "../merchandise-type-domain/merchandise-type-entity";

export class MerchandiseTypeViewDto {
    typeId: string;
    merchandiseTypeName: string;
    shopId: string;
    createdAt: string;
    updatedAt: string;

    static mapToView(productType: MerchandiseTypeDocument): MerchandiseTypeViewDto {
        // console.log('PhotoAlbumViewDto: mapToView - photoAlbum 😡 ', photoAlbum)
        const dto = new MerchandiseTypeViewDto();
        dto.typeId = productType._id.toString();
        dto.merchandiseTypeName = productType.merchandiseTypeName;
        dto.shopId = productType.shopId;
        dto.createdAt = productType.createdAt;
        dto.updatedAt = productType.updatedAt;
        // console.log('PhotoAlbumViewDto: mapToView - dto 😡 ', dto)
        return dto;
    }
}