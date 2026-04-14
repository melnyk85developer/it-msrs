//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { MyShopsSortBy } from './shops-sort-by';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetMyShopsQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = MyShopsSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchAlbumName: string | null = null;
    @IsOptional()
    @IsString()
    searchImage: string | null = null;
    @IsOptional()
    @IsString()
    searchMiniature: string | null = null;
}