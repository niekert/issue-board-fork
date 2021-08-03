export interface PageQuery {
    offset: number;
    limit: number;
}

export interface PageResponse<T> {
    totalCount: number;
    results: T[];
}
