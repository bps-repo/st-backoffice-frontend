import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard', // Optional: Redirect to default child path
        pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: () =>
            import('./features/features.module').then((m) => m.FeaturesModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SchoolarRoutingModule {}
