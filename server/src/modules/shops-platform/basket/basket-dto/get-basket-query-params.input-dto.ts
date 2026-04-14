//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';
import { PhotoAlbumSortBy } from './basket.sort-by';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetPhotoAlbumQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = PhotoAlbumSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    searchPhotoAlbum: string | null = null;
}