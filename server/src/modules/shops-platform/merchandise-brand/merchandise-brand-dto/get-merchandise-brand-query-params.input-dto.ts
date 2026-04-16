//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';
import { MerchandiseBrandSortBy } from './merchandise-brand.sort-by';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetMerchandiseBrandQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = MerchandiseBrandSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchMerchandiseBrand: string | null = null;
}