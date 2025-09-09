import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Employee, EmployeeStatus, CreateEmployeeRequest } from 'src/app/core/models/corporate/employee';
import { CreateUserRequest } from 'src/app/core/models/auth/user';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { finalize } from 'rxjs/operators';
import { RoleService } from 'src/app/core/services/role.service';
import { Role } from 'src/app/core/models/auth/role';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RolesPermissionsService } from 'src/app/core/services/roles-permissions.service';
import { Permission } from 'src/app/core/models/auth/permission';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { Store } from '@ngrx/store';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import { Center } from 'src/app/core/models/corporate/center';
import { Observable, map } from 'rxjs';
import { PermissionSelectorComponent } from 'src/app/shared/components/permission-selector/permission-selector.component';
import { PermissionTreeSelectorComponent } from 'src/app/shared/components/permission-tree-selector/permission-tree-selector.component';

@Component({
    selector: 'app-create',
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
        TreeSelectModule,
        TreeModule,
        PermissionTreeSelectorComponent
    ]
})
export class CreateComponent implements OnInit {
    employeeForm!: FormGroup;
    loading = false;
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
    permissionTree: TreeNode[] = [];
    selectedRole: Role | null = null;
    selectedPermissions: TreeNode[] = [];
    selectedPermissionIds: string[] = [];
    centers$: Observable<{ label: string, value: string }[]>;
    loadingRoles = false;

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        private roleService: RoleService,
        private rolesPermissionsService: RolesPermissionsService,
        private router: Router,
        private store: Store
    ) {
        // Initialize centers dropdown
        this.centers$ = this.store.select(CenterSelectors.selectAllCenters).pipe(
            map(centers => centers?.map(center => ({ label: center.name, value: center.id })) || [])
        );
    }

    ngOnInit(): void {
        this.loadRoles();
        this.loadPermissions();
        this.loadCenters();
        this.initForm();
    }

    loadCenters(): void {
        this.store.dispatch(CenterActions.loadCenters());
    }

    loadRoles(): void {
        this.loadingRoles = true;
        // Use the direct HTTP method instead of NgRx store for now
        this.roleService.fetchRoles().subscribe({
            next: (roles) => {
                console.log('Loaded roles:', roles);
                this.roles = roles || [];
                this.loadingRoles = false;
            },
            error: (error) => {
                console.error('Error loading roles:', error);
                this.roles = [];
                // Fallback: try using RolesPermissionsService
                this.loadRolesFromPermissionsService();
            }
        });
    }

    loadRolesFromPermissionsService(): void {
        this.rolesPermissionsService.getRoles().subscribe({
            next: (roles) => {
                console.log('Loaded roles from permissions service:', roles);
                this.roles = roles || [];
                this.loadingRoles = false;
            },
            error: (error) => {
                console.error('Error loading roles from permissions service:', error);
                this.roles = [];
                this.loadingRoles = false;
            }
        });
    }

    loadPermissions(): void {
        this.rolesPermissionsService.getPermissionsTree().subscribe({
            next: (permissions) => {
                this.permissions = permissions;
                this.buildPermissionTree(permissions);
            },
            error: (error) => {
                console.error('Error loading permissions tree', error);
                // Fallback to flat permissions if tree endpoint fails
                this.rolesPermissionsService.getPermissions().subscribe({
                    next: (flatPermissions) => {
                        this.permissions = flatPermissions;
                        this.buildPermissionTree(flatPermissions);
                    },
                    error: (fallbackError) => {
                        console.error('Error loading flat permissions', fallbackError);
                    }
                });
            }
        });
    }

    buildPermissionTree(permissions: Permission[]): void {
        // Create a map to store parent-child relationships
        const permissionMap = new Map<string, TreeNode>();

        // First pass: create TreeNode objects for each permission
        permissions.forEach(permission => {
            permissionMap.set(permission.id, {
                key: permission.id,
                label: permission.name,
                data: permission,
                children: [],
                selectable: true
            });
        });

        // Second pass: build the tree structure
        const rootNodes: TreeNode[] = [];

        permissions.forEach(permission => {
            const node = permissionMap.get(permission.id);

            if (permission.children && permission.children.length > 0) {
                // Add children to this node
                permission.children.forEach(child => {
                    const childNode = permissionMap.get(child.id);
                    if (childNode) {
                        node?.children?.push(childNode);
                    }
                });
            }

            // If this is a top-level permission (no parent), add to root nodes
            // This is a simplified approach - you may need to adjust based on your actual data structure
            if (!permission.children || permission.children.length === 0) {
                rootNodes.push(node!);
            }
        });

        this.permissionTree = rootNodes;
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
        // Find the TreeNodes that correspond to the selected permission IDs
        const findSelectedNodes = (nodes: TreeNode[], selectedIds: string[]): TreeNode[] => {
            let result: TreeNode[] = [];

            nodes.forEach(node => {
                if (selectedIds.includes(node.key as string)) {
                    result.push(node);
                }

                if (node.children && node.children.length > 0) {
                    result = [...result, ...findSelectedNodes(node.children, selectedIds)];
                }
            });

            return result;
        };

        // Update the selected nodes
        this.selectedPermissions = findSelectedNodes(this.permissionTree, permissionIds);
    }

    onPermissionNodeSelect(event: any): void {
        const node = event.node as TreeNode;
        const permissionId = node.key as string;

        // Add the permission ID to the selected permissions if not already there
        if (!this.selectedPermissionIds.includes(permissionId)) {
            this.selectedPermissionIds = [...this.selectedPermissionIds, permissionId];
        }

        // If the node has children, select them too (handled by the tree component)

        // Update the form control value
        this.updateFormPermissions();
    }

    onPermissionNodeUnselect(event: any): void {
        const node = event.node as TreeNode;
        const permissionId = node.key as string;

        // Remove the permission ID from the selected permissions
        this.selectedPermissionIds = this.selectedPermissionIds.filter(id => id !== permissionId);

        // If the node has children, unselect them too (handled by the tree component)

        // Update the form control value
        this.updateFormPermissions();
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

        this.loading = true;
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

        this.employeeService.createEmployee(employeeData)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (createdEmployee) => {
                    this.router.navigate(['/corporate/employees', createdEmployee.id]);
                },
                error: (error) => {
                    console.error('Error creating employee', error);
                }
            });
    }

    cancel(): void {
        this.router.navigate(['/corporate/employees']);
    }
}
