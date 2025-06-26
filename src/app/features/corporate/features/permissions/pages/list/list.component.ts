import {Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Permission} from 'src/app/core/models/auth/permission';
import {PermissionService} from 'src/app/core/services/permission.service';

import {Observable, Subject, of} from 'rxjs';
import {catchError, finalize, takeUntil} from 'rxjs/operators';
import {ButtonModule} from 'primeng/button';
import {COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS} from "../../constants";
import {TableHeaderAction} from "../../../../../../shared/components/tables/global-table/table-header.component";

@Component({
    selector: 'app-permissions-list',
    imports: [
        CommonModule,
        RouterModule,
        GlobalTable,
        ButtonModule
    ],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {

    // Custom Templates for the table
    @ViewChild('createdAtTemplate', {static: true})
    createdAtTemplate!: TemplateRef<any>;

    @ViewChild('updatedAtTemplate', {static: true})
    updatedAtTemplate!: TemplateRef<any>;

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
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.loadPermissions();
    }

    ngAfterViewInit() {
        this.customTemplates = {
            createdAt: this.createdAtTemplate,
            updatedAt: this.updatedAtTemplate
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadPermissions(): void {
        this.loading = true;
        this.loading$ = of(true);

        this.permissions$ = this.permissionService.getPermissions().pipe(
            takeUntil(this.destroy$),
            catchError(error => {
                console.error('Error loading permissions', error);
                return of([]);
            }),
            finalize(() => {
                this.loading = false;
                this.loading$ = of(false);
            })
        );
    }

    onRowSelect(permission: Permission) {
        this.router.navigate(['/corporate/permissions', permission.id]);
    }

    navigateToCreatePermission() {
        this.router.navigate(['/corporate/permissions/create']);
    }
}
