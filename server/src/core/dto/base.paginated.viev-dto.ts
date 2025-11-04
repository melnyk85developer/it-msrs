//базовый класс view модели для запросов за списком с пагинацией
export abstract class PaginatedViewDto<T> {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    abstract items: T;

    //статический метод-утилита для мапинга
    public static mapToView<T>(data: {
        totalCount: number;
        page: number;
        size: number;
        items: T;
    }
    ): PaginatedViewDto<T> {
        return {
            pagesCount: Math.ceil(data.totalCount / data.size),
            page: data.page,
            pageSize: data.size,
            totalCount: data.totalCount,
            items: data.items,
        };
    }
}