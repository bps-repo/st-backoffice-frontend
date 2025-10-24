import {Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Role} from 'src/app/core/models/auth/role';
import {RoleService} from 'src/app/core/services/role.service';

import {Observable, Subject, of} from 'rxjs';
import {catchError, finalize, takeUntil} from 'rxjs/operators';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS} from "../../constants";
import {TableHeaderAction} from "../../../../../../shared/components/tables/global-table/table-header.component";
import {Store} from "@ngrx/store";
import {selectAllRoles, selectRolesLoading} from "../../../../../../core/store/roles/roles.selectors";
import {loadRoles, setSelectedRole} from "../../../../../../core/store/roles/roles.actions";

@Component({
    selector: 'app-roles-list',
    imports: [
        CommonModule,
        RouterModule,
        GlobalTable,
        ButtonModule,
        TagModule
    ],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {

    // Custom Templates for the table
    @ViewChild('permissionsTemplate', {static: true})
    permissionsTemplate!: TemplateRef<any>;

    roles$: Observable<Role[]> = of([]);
    loading$: Observable<boolean> = of(false);
    columns: TableColumn[] = COLUMNS;
    globalFilterFields: string[] = GLOBAL_FILTERS;
    customTemplates: Record<string, TemplateRef<any>> = {};
    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private store$: Store,
    ) {
        this.loading$ = this.store$.select(selectRolesLoading)
        this.roles$ = this.store$.select(selectAllRoles)
    }

    ngOnInit(): void {
        // Clear the selected role when navigating to the list view
        this.store$.dispatch(setSelectedRole({ id: null }));
        this.loadRoles();
    }

    ngAfterViewInit() {
        this.customTemplates = {
            permissions: this.permissionsTemplate
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadRoles(): void {
        this.store$.dispatch(loadRoles())
    }

    onRowSelect(role: Role) {
        this.router.navigate(['/corporate/roles', role.id]).then();
    }

    navigateToCreateRole() {
        this.router.navigate(['/corporate/roles/create']).then();
    }
}
