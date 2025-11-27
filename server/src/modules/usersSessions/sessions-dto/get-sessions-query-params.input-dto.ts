import { IsOptional, IsString } from 'class-validator';
import { SessionSortBy } from './sessions-sort-by';
import { BaseQueryParams } from 'src/core/dto/base.query-params.input-dto';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetSessionsQueryParams extends BaseQueryParams {
    @IsOptional()
    @IsString()
    sortBy = SessionSortBy.CreatedAt;
    @IsOptional()
    @IsString()
    ip: string | null = null;
    @IsOptional()
    @IsString()
    browserName: string | null = null;
    @IsOptional()
    @IsString()
    browserVersion: string | null = null;
    @IsOptional()
    @IsString()
    osName: string | null = null;
    @IsOptional()
    @IsString()
    osVersion?: string | null = null;
    @IsOptional()
    @IsString()
    device?: string | null = null;
    @IsOptional()
    @IsString()
    country: string | null = null;
    @IsOptional()
    @IsString()
    city: string | null = null;
}