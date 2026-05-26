export interface PaymentTrendsDataset {
    label: string;
    data: number[];
}

/** Chart payload from `/dashboards/finance/payments/trends` */
export interface PaymentTrends {
    labels: string[];
    datasets: PaymentTrendsDataset[];
}

/** `/dashboards/finance/payments/summary` */
export interface PaymentSummary {
    totalPaid: number;
    pendingAmount: number;
    overdueAmount: number;
    currency: string;
    lastUpdated: string;
}

/** Same query shape as invoices trends / overview filters */
export interface PaymentDashboardFilter {
    dateFrom: string;
    dateTo: string;
    centerId?: string;
}
