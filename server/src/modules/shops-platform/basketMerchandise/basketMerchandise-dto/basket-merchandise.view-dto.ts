import { OmitType } from "@nestjs/swagger";
import {BasketMerchandiseDocument } from "../basketMerchandise-domain/basket-merchandise-entity";

export class BasketMerchandiseViewDto {
    basketMerchandiseId: string;
    merchandiseId: string;
    basketId: string;
    shopId: string;
    merchandiseName: string;
    merchandiseCoverName: string | null;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;

    static mapToView(product: BasketMerchandiseDocument): BasketMerchandiseViewDto {
        // console.log('PhotoAlbumViewDto: mapToView - photoAlbum 😡 ', photoAlbum)
        const dto = new BasketMerchandiseViewDto();
        dto.basketMerchandiseId = product._id.toString();
        dto.basketId = product.basketId;
        dto.merchandiseId = product.merchandiseId;
        dto.shopId = product.shopId;
        dto.merchandiseName = product.merchandiseName;
        dto.merchandiseCoverName = product.merchandiseCoverName;
        dto.quantity = Number(product.quantity);
        dto.price = Number(product.price);
        dto.createdAt = product.createdAt;
        dto.updatedAt = product.updatedAt;
        // console.log('PhotoAlbumViewDto: mapToView - dto 😡 ', dto)
        return dto;
    }
}