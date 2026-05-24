export interface AnalyticsCashflowMonthlyItem {
    year: number;
    month: number;
    monthName: string;
    inflow: number;
    pending: number;
    overdue: number;
    contractsOriginated: number;
    netFlow: number;
    inflowGrowthRate?: number;
}

export interface AnalyticsCashflow {
    totalInflow: number;
    totalPending: number;
    totalOverdue: number;
    netPosition: number;
    averageMonthlyInflow: number;
    bestInflowMonth: string;
    worstInflowMonth: string;
    monthlyData: AnalyticsCashflowMonthlyItem[];
}

export interface AnalyticsCashflowFilter {
    dateFrom: string;
    dateTo: string;
    centerId?: string;
}
