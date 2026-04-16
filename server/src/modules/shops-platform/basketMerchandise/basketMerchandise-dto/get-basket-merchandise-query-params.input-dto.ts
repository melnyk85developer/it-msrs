//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';
import { BasketMerchandiseSortBy } from './basket-merchandise.sort-by';
import { ApiProperty } from '@nestjs/swagger';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetBasketMerchandiseQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = BasketMerchandiseSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchName: string | null = null;
    @ApiProperty({ example: 'basketId', description: 'Уникальный идентификатор корзины' })
    @IsOptional()
    basketId: string;
    @ApiProperty({ example: 'shopId', description: 'Уникальный идентификатор магазина' })
    @IsOptional()
    shopId: string;
}