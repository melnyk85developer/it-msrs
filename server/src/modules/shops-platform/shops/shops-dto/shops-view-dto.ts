import { OmitType } from "@nestjs/swagger";
import { MyShopsDocument } from "../shops-domain/shops-entity";

export class MyShopsViewDto {
    shopId: string;
    name: string | null;
    title: string | null;
    shopTypeId: string;
    shopBrandId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;

    static mapMyShopsToView(shop: MyShopsDocument): MyShopsViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new MyShopsViewDto();
        dto.shopId = shop._id.toString();
        dto.name = shop.name;
        dto.title = shop.title;
        dto.shopTypeId = shop.shopTypeId;
        dto.shopBrandId = shop.shopBrandId;
        dto.userId = shop.userId;
        dto.createdAt = shop.createdAt;
        dto.updatedAt = shop.updatedAt;
        // console.log('UsersController: mapToView - dto 😡 ', dto)
        return dto;
    }
}