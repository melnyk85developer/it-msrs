import { OmitType } from "@nestjs/swagger";
import { ShopBrandDocument } from "../shop-brand-domain/shop-brand-entity";

export class ShopBrandViewDto {
    brandId: string;
    brandName: string;
    userId: string;
    createdAt: string;
    updatedAt: string;

    static mapShopBrandToView(brand: ShopBrandDocument): ShopBrandViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new ShopBrandViewDto();
        dto.brandId = brand._id.toString();
        dto.brandName = brand.brandName;
        dto.userId = brand.userId;
        dto.createdAt = brand.createdAt;
        dto.updatedAt = brand.updatedAt;
        // console.log('UsersController: mapToView - dto 😡 ', dto)
        return dto;
    }
}