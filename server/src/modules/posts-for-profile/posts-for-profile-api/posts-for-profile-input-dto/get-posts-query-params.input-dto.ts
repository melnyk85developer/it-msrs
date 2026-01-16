//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { PostForProfileSortBy } from './posts-sort-by';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetPostForProfileQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = PostForProfileSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchTitleTerm: string | null = null;
    @IsOptional()
    @IsString()
    searchContentTerm: string | null = null;
}