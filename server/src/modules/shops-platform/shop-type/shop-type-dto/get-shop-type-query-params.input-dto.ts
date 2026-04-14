//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { ShopTypeSortBy } from './shop-type-sort-by';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetShopTypeQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = ShopTypeSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchShopTypeName: string | null = null;
}