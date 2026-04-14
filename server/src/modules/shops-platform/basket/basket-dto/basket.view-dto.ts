import { OmitType } from "@nestjs/swagger";
import { BasketDocument } from "../basket-domain/basket-entity";

export class BasketViewDto {
    basketId: string;
    shopId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;

    static mapToView(basket: BasketDocument): BasketViewDto {
        // console.log('PhotoAlbumViewDto: mapToView - photoAlbum 😡 ', photoAlbum)
        const dto = new BasketViewDto();
        dto.basketId = basket._id.toString();
        dto.userId = basket.userId;
        dto.shopId = basket.shopId;
        dto.createdAt = basket.createdAt;
        dto.updatedAt = basket.updatedAt;
        // console.log('PhotoAlbumViewDto: mapToView - dto 😡 ', dto)
        return dto;
    }
}