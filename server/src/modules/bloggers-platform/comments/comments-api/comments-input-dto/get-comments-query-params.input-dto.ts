//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PostsSortBy } from './comments-sort-by';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetCommentsQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = PostsSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchContentTerm: string | null = null;
}