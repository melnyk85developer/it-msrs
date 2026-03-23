//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { DialogAiAssistantSortBy } from './dialog-ai-assistant-sort-by';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetDialogsAiAssistantQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = DialogAiAssistantSortBy.CreatedAt;
}