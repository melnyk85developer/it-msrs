//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { UsersSortBy } from './users-sort-by';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';

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