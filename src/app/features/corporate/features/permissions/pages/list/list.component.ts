import {Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Permission} from 'src/app/core/models/auth/permission';
import {PermissionService} from 'src/app/core/services/permission.service';

import {Observable, Subject, of} from 'rxjs';
import {catchError, finalize, takeUntil} from 'rxjs/operators';
import {ButtonModule} from 'primeng/button';
import {SelectButtonModule} from 'primeng/selectbutton';
import {COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS} from "../../constants";
import {TableHeaderAction} from "../../../../../../shared/components/tables/global-table/table-header.component";
import {PermissionTreeViewComponent} from "../../components/tree-view/tree-view.component";
import {FormsModule} from "@angular/forms";
import {Store} from "@ngrx/store";
import {selectPermissionsLoading} from "../../../../../../core/store/permissions/selectors/permissions.selectors";

@Component({
    selector: 'app-permissions-list',
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        SelectButtonModule,
        PermissionTreeViewComponent,
        FormsModule
    ],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit, OnDestroy {

    // Custom Templates for the table
    permissions$: Observable<Permission[]> = of([]);
    loading$: Observable<boolean> = of(false);
    columns: TableColumn[] = COLUMNS;
    globalFilterFields: string[] = GLOBAL_FILTERS;
    customTemplates: Record<string, TemplateRef<any>> = {};
    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    private loading = false;
    private destroy$ = new Subject<void>();

    constructor(
        private permissionService: PermissionService,
        private router: Router,
        private readonly store$: Store
    ) {
        this.loading$ = this.store$.select(selectPermissionsLoading)
    }

    ngOnInit(): void {
        this.loadPermissions();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadPermissions(): void {
        this.permissions$ = this.permissionService.getPermissions().pipe(
            takeUntil(this.destroy$),
            catchError(error => {
                console.error('Error loading permissions', error);
                return of([]);
            }),
            finalize(() => {
            })
        );
    }

    onRowSelect(permission: Permission) {
        this.router.navigate(['/corporate/permissions', permission.id]).then();
    }

    navigateToCreatePermission() {
        this.router.navigate(['/corporate/permissions/create']).then();
    }
}
