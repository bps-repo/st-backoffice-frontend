import { financePaymentDashboardFeature } from './payment-dashboard.feature';

export const selectFinancePaymentDashboardState = financePaymentDashboardFeature.selectFinancePaymentDashboardState;
export const selectFinancePaymentDashboardSummary = financePaymentDashboardFeature.selectSummary;
export const selectFinancePaymentDashboardTrends = financePaymentDashboardFeature.selectTrends;
/** True while payment summary & trends forkJoin is loading. */
export const selectFinancePaymentDashboardLoading = financePaymentDashboardFeature.selectLoading;
export const selectFinancePaymentDashboardError = financePaymentDashboardFeature.selectError;
export const selectFinancePaymentDashboardFilter = financePaymentDashboardFeature.selectFilter;
