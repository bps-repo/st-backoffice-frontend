## Dashboards Backend Spec

Purpose: Single source of truth for backend endpoints and KPIs needed by the dashboards in this project. Responses should be fast (<=300ms for summaries), cacheable, and shaped for direct UI use.

Conventions
- Params: dateFrom, dateTo (ISO 8601), centerId, studentId, status[], contractType[], groupBy=day|week|month
- Pagination only for listing endpoints (e.g., recent items). Default page=0,size=10
- Currency: ISO 4217 (e.g., "AOA"). Amounts as numbers.
- Timestamps: ISO 8601 strings.
- Include lastUpdated in summaries when feasible.

Common KPI Format
```json
{
  "kpis": [
    { "key": "<machine_key>", "label": "<Human Label>", "current": 0, "diffPct": 0 },
    ...
  ],
  "lastUpdated": "2025-10-01T10:11:25Z"
}
```

---

Finance – Payments Dashboard

KPIs
- totalPaid: Sum of completed payments in period
- pendingAmount: Sum of PENDING_PAYMENT installments due in period
- overdueAmount: Sum of OVERDUE installments due before now
- recentPayments: last N payments
- upcomingInstallments: installments due within horizon window
- paymentDistribution: [paid, pending, overdue]
- paymentTrends: payments and installments amounts per period

Endpoints
1) GET /dashboards/finance/payments/summary
   - Params: dateFrom, dateTo, centerId
   - Response:
   ```json
   {
     "totalPaid": 2450,
     "pendingAmount": 950,
     "overdueAmount": 150,
     "currency": "AOA",
     "lastUpdated": "2025-10-01T10:11:25Z"
   }
   ```

2) GET /dashboards/finance/payments/recent
   - Params: dateFrom, dateTo, centerId, page, size
   - Response:
   ```json
   {
     "items": [
       { "id": "p1", "invoiceId": "inv-101", "amount": 500, "paymentDate": "2025-05-20", "method": "CREDIT_CARD", "status": "COMPLETED", "studentName": "...", "centerName": "..." }
     ],
     "page": 0,
     "size": 10,
     "total": 37
   }
   ```

3) GET /dashboards/finance/payments/upcoming-installments
   - Params: dateTo (e.g., now+30d), centerId, page, size
   - Response:
   ```json
   {
     "items": [
       { "id": "i1", "contractId": "c1", "installmentNumber": 2, "totalInstallments": 3, "dueDate": "2025-06-01", "amount": 300, "status": "PENDING_PAYMENT", "studentName": "..." }
     ],
     "page": 0,
     "size": 10,
     "total": 120
   }
   ```

4) GET /dashboards/finance/payments/distribution
   - Params: dateFrom, dateTo, centerId
   - Response:
   ```json
   { "paid": 2450, "pending": 950, "overdue": 150 }
   ```

5) GET /dashboards/finance/payments/trends
   - Params: dateFrom, dateTo, groupBy, centerId
   - Response:
   ```json
   {
     "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
     "datasets": [
       { "label": "Payments", "data": [1200, 1900, 1500, 2800, 2450, 0] },
       { "label": "Installments", "data": [800, 1100, 900, 1600, 950, 0] }
     ]
   }
   ```

---

Finance – Invoices Dashboard

KPIs
- totalInvoiced: sum of invoice amounts in period
- proformaCount: number of pro-forma invoices
- receiptsCount: number of receipts issued
- reportsCount: generated finance reports
- invoicesTrends: billed amount per period
- receiptsTrends: receipts count per period
- docDistribution: pie by doc type [proforma, receipts, reports]

Endpoints
1) GET /dashboards/finance/invoices/summary
   - Params: dateFrom, dateTo, centerId
   - Response:
   ```json
   {
     "totalInvoiced": 8500,
     "proformaCount": 23,
     "receiptsCount": 18,
     "reportsCount": 6,
     "currency": "AOA"
   }
   ```

2) GET /dashboards/finance/invoices/distribution
   - Params: dateFrom, dateTo, centerId
   - Response:
   ```json
   { "proforma": 23, "receipts": 18, "reports": 6 }
   ```

3) GET /dashboards/finance/invoices/trends
   - Params: dateFrom, dateTo, groupBy, centerId
   - Response:
   ```json
   {
     "labels": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
     "datasets": [
       { "label": "Faturado (AOA)", "data": [6000, 7200, 8100, 7500, 8200, 8500] },
       { "label": "Recibos Emitidos", "data": [15, 18, 20, 19, 17, 18] }
     ]
   }
   ```

---

Corporate Dashboard

KPIs
- activeCenters
- activeContracts
- employeesCount
- reportsCount
- contractsTrends: created/renewed per period
- employeesDistribution: per center
- alerts: recent corporate events

Endpoints
1) GET /dashboards/corporate/summary
   - Response:
   ```json
   {
     "kpis": [
       { "key": "activeCenters", "label": "Centros Ativos", "current": 5, "diffPct": 0 },
       { "key": "activeContracts", "label": "Contratos Ativos", "current": 38, "diffPct": 12 },
       { "key": "employeesCount", "label": "Funcionários", "current": 124, "diffPct": 8 },
       { "key": "reportsCount", "label": "Relatórios Emitidos", "current": 47, "diffPct": -2 }
     ]
   }
   ```

2) GET /dashboards/corporate/contracts/trends
   - Params: dateFrom, dateTo, groupBy

3) GET /dashboards/corporate/employees/distribution
   - Response: { "labels": ["Centro A", "Centro B"], "data": [40, 84] }

4) GET /dashboards/corporate/alerts
   - Response:
   ```json
   { "items": [ { "label": "Novo Centro", "description": "Centro Zona Sul inaugurado", "createdAt": "..." } ] }
   ```

---

Schoolar – General Dashboard

KPIs
- totalStudents, activeStudents, inactiveStudents
- totalLessons, avgAttendancePct, cancellationsPct
- materialsViews, materialsCompletions
- assessmentsCount, avgScore

Endpoints
1) GET /dashboards/schoolar/general/summary
2) GET /dashboards/schoolar/general/trends (dateFrom, dateTo, groupBy)

---

Schoolar – Students Dashboard

KPIs
- totalStudents
- byStatus: ACTIVE / INACTIVE / HOLD
- newStudentsInPeriod
- enrollmentsTrends

Endpoints
1) GET /dashboards/schoolar/students/summary
2) GET /dashboards/schoolar/students/trends (dateFrom, dateTo, groupBy)

---

Schoolar – Lessons Dashboard

KPIs
- totalLessons
- avgAttendancePct
- cancellationsPct
- attendanceTrends
- scheduleTypeDistribution

Endpoints
1) GET /dashboards/schoolar/lessons/summary
2) GET /dashboards/schoolar/lessons/attendance/trends (dateFrom, dateTo, groupBy)
3) GET /dashboards/schoolar/lessons/schedule-types

---

Schoolar – Classes Dashboard

KPIs
- classesActive
- utilizationPct
- capacityByCenter
- classesTrends

Endpoints
1) GET /dashboards/schoolar/classes/summary
2) GET /dashboards/schoolar/classes/trends (dateFrom, dateTo, groupBy)

---

Schoolar – Assessments Dashboard

KPIs
- assessmentsCount
- avgScore
- byType or byLevel distribution
- assessmentsTrends

Endpoints
1) GET /dashboards/schoolar/assessments/summary
2) GET /dashboards/schoolar/assessments/trends (dateFrom, dateTo, groupBy)

---

Schoolar – Materials Dashboard

KPIs
- materialsCreated
- materialsViews
- materialsCompletions
- byLevel distribution
- materialsTrends

Endpoints
1) GET /dashboards/schoolar/materials/summary
2) GET /dashboards/schoolar/materials/trends (dateFrom, dateTo, groupBy)

---

Calendars (Scheduling) Dashboard

KPIs
- totalSchedules
- utilizationRate
- avgAttendancePct
- cancellationRate
- scheduleTypeDistribution
- heatmap (weekday/hour density)
- monthlyLessons
- attendanceTrends

Endpoints
1) GET /dashboards/calendars/summary
2) GET /dashboards/calendars/schedule-types
3) GET /dashboards/calendars/heatmap (dateFrom, dateTo)
   - Response example (matrix-like):
   ```json
   {
     "weekdays": ["Mon","Tue","Wed","Thu","Fri","Sat"],
     "hours": ["08:00","09:00", "..."],
     "values": [[2,1,0,...],[3,4,1,...],...]
   }
   ```
4) GET /dashboards/calendars/monthly-lessons (dateFrom, dateTo)
5) GET /dashboards/calendars/attendance/trends (dateFrom, dateTo, groupBy)

---

Implementation Notes
- Index and aggregate on payment_date, due_date, createdAt for trend queries.
- Precompute daily aggregates for hot windows (last 90 days) to meet latency.
- Prefer returning display-ready series (labels + datasets) where charts are fixed.
- Apply authorization filters (center scope, roles) at query time.


