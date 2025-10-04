import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Role } from 'src/app/core/models/auth/role';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from "primeng/ripple";
import { Store } from "@ngrx/store";
import { selectRolesLoading, selectSelectedRole } from "../../../../../../core/store/roles/roles.selectors";
import { loadRole, updateRole, deleteRole } from 'src/app/core/store/roles/roles.actions';

@Component({
    selector: 'app-role-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ButtonModule,
        TabViewModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        ProgressSpinnerModule,
        ConfirmDialogModule,
        ToastModule,
        RippleModule
    ],
    providers: [ConfirmationService, MessageService]
})
export class DetailComponent implements OnInit, OnDestroy {
    role: Role | null = null;
    role$!: Observable<Role | null>;
    loading$: Observable<boolean> = of(false);
    editDialogVisible = false;
    roleForm!: FormGroup;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private readonly store$: Store
    ) {
        this.role$ = this.store$.select(selectSelectedRole) as Observable<Role | null>;
        this.loading$ = this.store$.select(selectRolesLoading);

        
    }

    ngOnInit(): void {
        this.initForm();
        this.route.paramMap.pipe(
            takeUntil(this.destroy$)
        ).subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loading$ = this.store$.select(selectRolesLoading);
                this.loadRole(id);
                this.role$.subscribe(role => {
                    this.role = role;
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    initForm(): void {
        this.roleForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required]
        });
    }

    loadRole(id: string): void {
        this.store$.dispatch(loadRole({ id }));
    }

    hideEditDialog(): void {
        this.editDialogVisible = false;
    }


    onEditRole(role: Role): void {
        this.editDialogVisible = true;
        this.roleForm.patchValue({
            name: role.name,
            description: role.description
        });
    }

    editRole(): void {
        if (this.roleForm.invalid || !this.role) {
            return;
        }

        if (!this.role) return;

        this.hideEditDialog();

        const updatedRole: Role = {
            ...this.role,
            name: this.roleForm.value.name,
            description: this.roleForm.value.description
        };

        this.store$.dispatch(updateRole({ role: updatedRole }));
    }

    deleteRole(): void {
        if (!this.role) return;

        this.confirmationService.confirm({
            message: `Tem certeza que deseja excluir a função "${this.role.name}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.store$.dispatch(deleteRole({ id: this.role!.id }));
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/corporate/roles']).then();
    }
}
