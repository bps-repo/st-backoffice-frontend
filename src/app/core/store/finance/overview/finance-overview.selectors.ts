import { financeOverviewFeature } from './finance-overview.feature';

export const selectFinanceOverviewState = financeOverviewFeature.selectFinanceOverviewState;
export const selectFinanceOverview = financeOverviewFeature.selectOverview;
/** Loading flag while the finance overview GET is in flight. */
export const selectFinanceOverviewLoading = financeOverviewFeature.selectLoading;
export const selectFinanceOverviewError = financeOverviewFeature.selectError;
export const selectFinanceOverviewFilter = financeOverviewFeature.selectFilter;
