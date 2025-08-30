export interface Sale {
    id: string;
    client: {
        name: string;
        email: string;
        phone?: string;
    };
    product: {
        type: 'Livro' | 'Certificado' | 'Declaração' | 'Serviço';
        name: string;
        quantity: number;
        unitPrice: number;
        total: number;
    };
    payment: {
        method: string;
        status: 'Pago' | 'Pendente' | 'Cancelado';
        reference?: string;
    };
    dates: {
        created: string;
        lastUpdate: string;
        paidAt?: string;
    };
    history: SaleHistoryItem[];
    notes?: string;
}

export interface SaleHistoryItem {
    action: string;
    description: string;
    timestamp: string;
    userId?: string;
    userName?: string;
}

export interface SaleFilter {
    searchTerm?: string;
    type?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    clientId?: string;
}

export interface SaleStatistics {
    totalSales: number;
    totalRevenue: number;
    averageSaleValue: number;
    salesByType: { [key: string]: number };
    salesByStatus: { [key: string]: number };
    salesByMonth: { [key: string]: number };
}
