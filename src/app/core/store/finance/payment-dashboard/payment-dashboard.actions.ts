import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PaymentDashboardFilter, PaymentSummary, PaymentTrends } from 'src/app/core/models/finance/payment-dashboard.model';

export const FINANCE_PAYMENT_DASHBOARD_FEATURE_KEY = 'financePaymentDashboard';

export const FinancePaymentDashboardActions = createActionGroup({
    source: FINANCE_PAYMENT_DASHBOARD_FEATURE_KEY,
    events: {
        Load: props<{ filter: PaymentDashboardFilter }>(),
        'Load Success': props<{ summary: PaymentSummary; trends: PaymentTrends }>(),
        'Load Failure': props<{ error: unknown }>(),
        'Clear Error': emptyProps(),
    },
});
