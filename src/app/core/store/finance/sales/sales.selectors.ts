import { createSelector } from '@ngrx/store';
import { salesFeature } from './sales.feature';
import { salesAdapter } from './sales.state';

const { selectAll, selectEntities } = salesAdapter.getSelectors();

export const selectSalesState = salesFeature.selectSalesState;
/** True while the sales list GET is in flight. */
export const selectSalesLoading = salesFeature.selectLoading;
export const selectSalesError = salesFeature.selectError;
/** True while a single-sale detail GET is in flight. */
export const selectSalesDetailLoading = salesFeature.selectDetailLoading;
export const selectSalesDetailError = salesFeature.selectDetailError;
export const selectSelectedSale = salesFeature.selectSelectedSale;

export const selectAllSales = createSelector(selectSalesState, (state) => selectAll(state));
export const selectSalesEntities = createSelector(selectSalesState, (state) => selectEntities(state));
