// src/app/features/schoolar/features/meetings/meetings.routes.ts
import { Routes } from '@angular/router';

export const MeetingsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/list/list.component').then((m) => m.MeetingsListComponent),
    },
];
