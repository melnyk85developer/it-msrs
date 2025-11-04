import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

//базовый класс для query параметров с пагинацией
//значения по-умолчанию применяются автоматически при настройке глобального ValidationPipe в main.ts
export class BaseQueryParams {
    //для трансформации в number
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    pageNumber: number = 1;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    pageSize: number = 10;

    @IsOptional()
    sortDirection: SortDirection = SortDirection.Desc;

    calculateSkip() {
        return (this.pageNumber - 1) * this.pageSize;
    }

    /**
     * Универсальная нормализация для всех наследников.
     * Работает с любым классом, унаследованным от BaseQueryParams.
     */
    static normalize<T extends BaseQueryParams>(
        this: new () => T,
        query: Partial<T>
    ): T {
        const normalized = new this();

        normalized.pageNumber = query.pageNumber ? +query.pageNumber : 1;
        normalized.pageSize = query.pageSize ? +query.pageSize : 10;

        // Надёжная нормализация sortDirection — допускаем 'asc'|'desc' (регистронезависимо)
        const sd = (query as any).sortDirection;
        normalized.sortDirection =
            typeof sd === 'string' && sd.toLowerCase() === 'asc'
                ? SortDirection.Asc
                : SortDirection.Desc;

        // копируем остальные поля, уникальные для конкретного наследника
        Object.assign(normalized, query);

        return normalized;
    }
}

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}