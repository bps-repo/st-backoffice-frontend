export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
    metadata: any[];
}

export interface PageableResponse<T> {
    content: T;
    paged: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    empty: boolean;
    totalElements: number;
    totalPages: number;
    pageable: {
        sort: {
            unsorted: boolean;
            sorted: boolean;
            empty: boolean;
        };
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    };
    sort: { unsorted: boolean, sorted: boolean, empty: boolean }[];
}

export interface SortableResponse<T> {
}

