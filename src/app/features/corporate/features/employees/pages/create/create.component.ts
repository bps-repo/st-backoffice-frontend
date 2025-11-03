import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateEmployeeRequest } from 'src/app/core/models/corporate/employee';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { takeUntil } from 'rxjs/operators';
import { Role } from 'src/app/core/models/auth/role';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Permission } from 'src/app/core/models/auth/permission';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import { Observable, map } from 'rxjs';
import { PermissionTreeSelectorComponent } from 'src/app/shared/components/permission-tree-selector/permission-tree-selector.component';
import { EmployeesActions } from 'src/app/core/store/corporate/employees/employees.actions';
import * as EmployeesSelectors from 'src/app/core/store/corporate/employees/employees.selectors';
import { Subject } from 'rxjs';
import * as RolesActions from 'src/app/core/store/roles/roles.actions';
import * as RolesSelectors from 'src/app/core/store/roles/roles.selectors';
import * as PermissionsActions from 'src/app/core/store/permissions/actions/permissions.actions';
import * as PermissionsSelectors from 'src/app/core/store/permissions/selectors/permissions.selectors';

@Component({
    selector: 'corporate-employees-create',
    templateUrl: './create.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        CalendarModule,
        MultiSelectModule,
        PasswordModule,
        InputNumberModule,
        RadioButtonModule,
        PermissionTreeSelectorComponent
    ]
})
export class CreateComponent implements OnInit, OnDestroy {
    employeeForm!: FormGroup;
    statusOptions = [
        { label: 'Ativo', value: 'ACTIVE' },
        { label: 'Inativo', value: 'INACTIVE' },
        { label: 'De Licença', value: 'ON_LEAVE' },
        { label: 'Terminado', value: 'TERMINATED' }
    ];
    genderOptions = [
        { label: 'Masculino', value: 'MALE' },
        { label: 'Feminino', value: 'FEMALE' },
    ];
    roles: Role[] = [];
    permissions: Permission[] = [];
    selectedRole: Role | null = null;
    selectedPermissionIds: string[] = [];
    centers$: Observable<{ label: string, value: string }[]>;
    creating$: Observable<boolean> | undefined;
    error$: Observable<string | null> | undefined;
    private destroy$ = new Subject<void>();
    loadingRoles = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private store: Store,
        private actions$: Actions
    ) {
        // Initialize centers dropdown
        this.centers$ = this.store.select(CenterSelectors.selectAllCenters).pipe(
            map(centers => centers?.map(center => ({ label: center.name, value: center.id })) || [])
        );
    }

    ngOnInit(): void {
        // Dispatch initial loads
        this.store.dispatch(RolesActions.loadRoles());
        this.store.dispatch(PermissionsActions.loadPermissionTree());
        this.store.dispatch(CenterActions.loadCenters());

        this.initForm();

        // Bind loading and error from employees feature
        this.creating$ = this.store.select(EmployeesSelectors.selectLoading);
        this.error$ = this.store.select(EmployeesSelectors.selectError);

        // Navigate on successful creation
        this.actions$.pipe(
            ofType(EmployeesActions.createEmployeeSuccess),
            takeUntil(this.destroy$)
        ).subscribe(({ employee }) => {
            this.router.navigate(['/corporate/employees', employee.id]);
        });

        // Subscribe to roles state
        this.store.select(RolesSelectors.selectAllRoles)
            .pipe(takeUntil(this.destroy$))
            .subscribe(roles => {
                this.roles = roles || [];
            });
        this.store.select(RolesSelectors.selectRolesLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => this.loadingRoles = !!loading);

        // Subscribe to permission tree
        this.store.select(PermissionsSelectors.selectPermissionTree)
            .pipe(takeUntil(this.destroy$))
            .subscribe(tree => {
                this.permissions = tree || [];
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


    initForm(): void {
        this.employeeForm = this.fb.group({
            user: this.fb.group({
                firstname: ['', Validators.required],
                lastname: ['', Validators.required],
                gender: ['MALE', Validators.required],
                dateOfBirth: [null, Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8)]],
                roleId: ['', Validators.required],
                additionalPermissionIds: [[]],
                photo: ['']
            }),
            centerId: ['', Validators.required],
            status: ['ACTIVE', Validators.required]
        });

        // Listen for role changes to update permissions
        this.employeeForm.get('user.roleId')?.valueChanges.subscribe(roleId => {
            if (roleId) {
                this.onRoleSelected(roleId);
            } else {
                this.selectedRole = null;
                this.selectedPermissionIds = [];
            }
        });
    }

    onRoleSelected(roleId: string): void {
        // Find the selected role from the loaded roles
        this.selectedRole = this.roles.find(role => role.id === roleId) || null;

        if (this.selectedRole && this.selectedRole.permissions) {
            // Set role permissions as selected (they will be shown as disabled in the new UI)
            this.selectedPermissionIds = [...this.selectedRole.permissions.map(p => p.id)];

            // Update form control
            this.updateFormPermissions();
        }
    }

    updateTreeSelectionState(permissionIds: string[]): void {
        // No local TreeNode management; child component renders the tree
    }

    updateFormPermissions(): void {
        // Update the form control with the current selected permission IDs
        // Remove the role's permission IDs from the list since those come automatically with the role
        const rolePermissionIds = this.selectedRole ? this.selectedRole.permissions?.map(p => p.id) || [] : [];
        const additionalPermissionIds = this.selectedPermissionIds.filter(id => !rolePermissionIds.includes(id));

        this.employeeForm.get('user.additionalPermissionIds')?.setValue(additionalPermissionIds);
    }

    onPermissionIdsChange(permissionIds: string[]): void {
        this.selectedPermissionIds = permissionIds;
        this.updateFormPermissions();
    }

    onSubmit(): void {
        if (this.employeeForm.invalid) {
            return;
        }

        const formValue = this.employeeForm.value;

        // Format date values
        let dateOfBirth = '';
        if (formValue.user.dateOfBirth) {
            dateOfBirth = formValue.user.dateOfBirth.toISOString().split('T')[0];
        }

        // Create the employee data object according to the new structure
        const employeeData: CreateEmployeeRequest = {
            user: {
                firstname: formValue.user.firstname,
                lastname: formValue.user.lastname,
                gender: formValue.user.gender,
                dateOfBirth: dateOfBirth,
                email: formValue.user.email,
                password: formValue.user.password,
                additionalPermissionIds: formValue.user.additionalPermissionIds || [],
                photo: formValue.user.photo || undefined
            },
            role: formValue.user.roleId, // Role ID
            centerId: formValue.centerId,
            status: formValue.status
        };

        this.store.dispatch(EmployeesActions.createEmployee({ employeeData }));
    }

    cancel(): void {
        this.router.navigate(['/corporate/employees']);
    }
}
