//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsOptional, IsString } from 'class-validator';
import { PhotoSortBy } from './photos-sort-by';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetPhotoQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = PhotoSortBy.CreatedAt;
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