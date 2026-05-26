export interface InvoiceTrendsDataset {
    label: string;
    data: number[];
}

export interface InvoiceTrends {
    labels: string[];
    datasets: InvoiceTrendsDataset[];
}

export interface InvoiceTrendsFilter {
    dateFrom: string;
    dateTo: string;
    centerId?: string;
}
