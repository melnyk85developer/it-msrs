import { OmitType } from "@nestjs/swagger";
import { MerchandiseBrandDocument } from "../merchandise-brand-domain/merchandise-brand.entity";

export class MerchandiseBrandViewDto {
    brandId: string;
    merchandiseBrandName: string;
    userId: string | null;
    shopId: string | null;
    createdAt: string;
    updatedAt: string;

    static mapToView(brand: MerchandiseBrandDocument): MerchandiseBrandViewDto {
        // console.log('PhotoAlbumViewDto: mapToView - photoAlbum 😡 ', photoAlbum)
        const dto = new MerchandiseBrandViewDto();
        dto.brandId = brand._id.toString();
        dto.merchandiseBrandName = brand.merchandiseBrandName;
        dto.userId = brand.userId;
        dto.shopId = brand.shopId;
        dto.createdAt = brand.createdAt;
        dto.updatedAt = brand.updatedAt;
        // console.log('PhotoAlbumViewDto: mapToView - dto 😡 ', dto)
        return dto;
    }
}