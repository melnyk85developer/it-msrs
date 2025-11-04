//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { BlogsSortBy } from './blogs-sort-by';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsOptional, IsString } from 'class-validator';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetBlogsQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = BlogsSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchNameTerm?: string | null = null;
    @IsOptional()
    @IsString()
    searchDescriptionTerm?: string | null = null;
    @IsOptional()
    @IsString()
    searchWebsiteUrlTerm?: string | null = null;
}