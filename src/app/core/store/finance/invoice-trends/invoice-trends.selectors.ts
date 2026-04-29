import { invoiceTrendsFeature } from './invoice-trends.feature';

export const selectInvoiceTrendsState = invoiceTrendsFeature.selectInvoiceTrendsState;
export const selectInvoiceTrends = invoiceTrendsFeature.selectTrends;
/** True while `/dashboards/finance/invoices/trends` GET is in flight. */
export const selectInvoiceTrendsLoading = invoiceTrendsFeature.selectLoading;
export const selectInvoiceTrendsError = invoiceTrendsFeature.selectError;
export const selectInvoiceTrendsFilter = invoiceTrendsFeature.selectFilter;
