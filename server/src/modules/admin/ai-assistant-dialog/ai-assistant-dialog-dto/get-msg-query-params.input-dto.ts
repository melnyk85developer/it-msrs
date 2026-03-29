//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DialogAiAssistantSortBy } from './dialog-ai-assistant-sort-by';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetAiAssistantMessageQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString({ message: 'sortBy сортировать по CreatedAt!' })
    sortBy = DialogAiAssistantSortBy.CreatedAt;
    @IsOptional()
    @IsString({ message: 'searchTextMessage ключевые слова для поиска сообщений!' })
    searchTextMessage: string | null = null;
    // @IsString({ message: 'receiverId должно быть строкой!' })
    // @IsNotEmpty({ message: 'Поле receiverId не должно быть пустым!' })
    // receiverId: string;
}