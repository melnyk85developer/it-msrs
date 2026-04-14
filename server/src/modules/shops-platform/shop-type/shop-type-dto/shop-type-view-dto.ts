import { OmitType } from "@nestjs/swagger";
import { ShopTypeDocument } from "../shop-type-domain/shop-type-entity";

export class ShopTypeViewDto {
    typeId: string;
    typeName: string;
    userId: string;
    createdAt: string;
    updatedAt: string;

    static mapShopTypeToView(type: ShopTypeDocument): ShopTypeViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new ShopTypeViewDto();
        dto.typeId = type._id.toString();
        dto.typeName = type.typeName;
        dto.userId = type.userId;
        dto.createdAt = type.createdAt;
        dto.updatedAt = type.updatedAt;
        // console.log('UsersController: mapToView - dto 😡 ', dto)
        return dto;
    }
}