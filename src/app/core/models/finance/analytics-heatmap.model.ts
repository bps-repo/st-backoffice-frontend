export interface AnalyticsHeatmapRow {
    centerId: string;
    centerName: string;
    /** 12-element array; null means no data for that month */
    monthlyRevenue: (number | null)[];
    yearTotal: number;
    bestMonthIndex: number;
    worstMonthIndex: number;
}

export interface AnalyticsHeatmap {
    year: number;
    monthLabels: string[];
    rows: AnalyticsHeatmapRow[];
}

export interface AnalyticsHeatmapFilter {
    dateFrom: string;
    dateTo: string;
    year: number;
}
