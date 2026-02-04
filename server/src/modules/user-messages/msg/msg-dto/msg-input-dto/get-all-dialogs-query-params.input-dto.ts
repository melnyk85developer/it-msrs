//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { MessageSortBy } from './messages-sort-by';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetDialogsQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = MessageSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchTextMessage: string | null = null;
}