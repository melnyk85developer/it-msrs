import { OmitType } from "@nestjs/swagger";
import { MerchandiseDocument } from "../merchandise-domain/merchandise.entity";

export class MerchandiseViewDto {
    productId: string;
    merchandiseName: string;
    shopId: string;
    typeId: string;
    brandId: string;
    price: string;
    rating: string;
    merchandiseImgName: string | null;
    merchandiseCoverName: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;

    static mapToView(product: MerchandiseDocument): MerchandiseViewDto {
        // console.log('PhotoAlbumViewDto: mapToView - photoAlbum 😡 ', photoAlbum)
        const dto = new MerchandiseViewDto();
        dto.productId = product._id.toString();
        dto.merchandiseName = product.merchandiseName;
        dto.shopId = product.shopId;
        dto.typeId = product.typeId;
        dto.brandId = product.brandId;
        dto.price = product.price;
        dto.rating = product.rating;

        dto.merchandiseImgName = product.merchandiseImgName;
        dto.merchandiseCoverName = product.merchandiseCoverName;
        dto.userId = product.userId;
        dto.createdAt = product.createdAt;
        dto.updatedAt = product.updatedAt;
        // console.log('PhotoAlbumViewDto: mapToView - dto 😡 ', dto)
        return dto;
    }
}