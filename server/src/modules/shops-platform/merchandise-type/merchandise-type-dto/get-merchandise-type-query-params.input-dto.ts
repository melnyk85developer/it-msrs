//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';
import { MerchandiseTypeSortBy } from './merchandise-type.sort-by';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetMerchandiseTypeQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = MerchandiseTypeSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchMerchandiseType: string | null = null;
    @IsOptional()
    @IsString()
    shopId: string;
    @IsOptional()
    @IsString()
    typeId: string;
    @IsOptional()
    @IsString()
    brandId: string;
}