export interface StudentFilters {
    searchTerm: string;
    status: 'ALL' | 'ACTIVE' | 'INACTIVE';
    levelId: string | null;
    classId: string | null;
    enrollmentDateRange: {
        start: Date | null;
        end: Date | null;
    };
}

export interface StudentFilters {
    searchTerm: string;
    status: 'ALL' | 'ACTIVE' | 'INACTIVE';
    levelId: string | null;
    classId: string | null;
    enrollmentDateRange: {
        start: Date | null;
        end: Date | null;
    };
}


export interface PaginationState {
    currentPage: number;
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}
