import { OmitType } from "@nestjs/swagger";
import { ShopTypeDocument } from "../shop-type-domain/shop-type-entity";

export class ShopTypeViewDto {
    typeId: string;
    typeName: string;
    userId: string;
    createdAt: string;
    updatedAt: string;

    static mapShopTypeToView(photo: ShopTypeDocument): ShopTypeViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new ShopTypeViewDto();
        dto.typeId = photo._id.toString();
        dto.typeName = photo.typeName;
        dto.userId = photo.userId;
        dto.createdAt = photo.createdAt;
        dto.updatedAt = photo.updatedAt;
        // console.log('UsersController: mapToView - dto 😡 ', dto)
        return dto;
    }
}