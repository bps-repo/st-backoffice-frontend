import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Employee} from 'src/app/core/models/corporate/employee';
import {RoleService} from 'src/app/core/services/role.service';
import {Subject, forkJoin} from 'rxjs';
import {takeUntil, finalize} from 'rxjs/operators';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {TagModule} from 'primeng/tag';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {RippleModule} from "primeng/ripple";
import {Role} from "../../../../../../../../core/models/auth/role";

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        DropdownModule,
        TagModule,
        ProgressSpinnerModule,
        ToastModule,
        RippleModule
    ],
    providers: [MessageService]
})
export class RolesComponent implements OnInit, OnDestroy {
    employee: Employee | null = null;
    availableRoles: Role[] = [];
    selectedRole: Role | null = null;
    loading = false;
    adding = false;
    removing = false;
    private destroy$ = new Subject<void>();
    private employeeId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private roleService: RoleService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.route.parent?.paramMap.pipe(
            takeUntil(this.destroy$)
        ).subscribe(params => {
            this.employeeId = params.get('id');
            if (this.employeeId) {
                this.loadData();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadData(): void {
        if (!this.employeeId) return;

        this.loading = true;
    }

    addRole(): void {
    }

    removeRole(role: Role): void {
        if (!this.employeeId) return;
        this.removing = true;
    }
}
