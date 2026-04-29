import { financeSellersFeature } from './finance-sellers.feature';

export const selectFinanceSellersState = financeSellersFeature.selectFinanceSellersState;
export const selectFinanceSellers = financeSellersFeature.selectSellers;
/** True while `/dashboards/finance/sellers` GET is in flight. */
export const selectFinanceSellersLoading = financeSellersFeature.selectLoading;
export const selectFinanceSellersError = financeSellersFeature.selectError;
export const selectFinanceSellersFilter = financeSellersFeature.selectFilter;
