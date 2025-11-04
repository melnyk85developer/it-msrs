//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { UsersSortBy } from './users-sort-by';
import { BaseQueryParams, SortDirection } from '../../../../core/dto/base.query-params.input-dto';
import { IsOptional, IsString } from 'class-validator';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetUsersQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = UsersSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchNameTerm?: string | null = null;
    @IsOptional()
    @IsString()
    searchLoginTerm?: string | null = null;
    @IsOptional()
    @IsString()
    searchEmailTerm?: string | null = null;
}