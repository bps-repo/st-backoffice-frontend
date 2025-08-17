import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {EmployeeService} from 'src/app/core/services/employee.service';
import {Employee, EmployeeStatus} from 'src/app/core/models/corporate/employee';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {finalize} from 'rxjs/operators';
import {RoleService} from 'src/app/core/services/role.service';
import {Role} from 'src/app/core/models/auth/role';
import {MultiSelectModule} from 'primeng/multiselect';
import {PasswordModule} from 'primeng/password';
import {InputNumberModule} from 'primeng/inputnumber';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RolesPermissionsService} from 'src/app/core/services/roles-permissions.service';
import {Permission} from 'src/app/core/models/auth/permission';
import {TreeSelectModule} from 'primeng/treeselect';
import {TreeModule} from 'primeng/tree';
import {TreeNode} from 'primeng/api';

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
        TreeModule
    ]
})
export class CreateComponent implements OnInit {
    employeeForm!: FormGroup;
    loading = false;
    statusOptions = [
        {label: 'Ativo', value: 'ACTIVE'},
        {label: 'Inativo', value: 'INACTIVE'},
        {label: 'De Licença', value: 'ON_LEAVE'},
        {label: 'Terminado', value: 'TERMINATED'}
    ];
    genderOptions = [
        {label: 'Masculino', value: 'MALE'},
        {label: 'Feminino', value: 'FEMALE'},
        {label: 'Outro', value: 'OTHER'}
    ];
    roles: Role[] = [];
    permissions: any[] = [];
    permissionTree: TreeNode[] = [];
    selectedRole: string = '';
    selectedPermissions: TreeNode[] = [];
    selectedPermissionIds: string[] = [];

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        private roleService: RoleService,
        private rolesPermissionsService: RolesPermissionsService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.loadRoles();
        this.loadPermissions();
        this.initForm();
    }

    loadRoles(): void {
        this.roleService.getRoles().subscribe(roles => {
            this.roles = roles;
        });
    }

    loadPermissions(): void {
        this.rolesPermissionsService.getPermissions().subscribe(permissions => {
            this.permissions = permissions;
            this.buildPermissionTree(permissions);
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
            hiringDate: [new Date(), Validators.required],
            wage: [0, [Validators.required, Validators.min(0)]],
            status: ['ACTIVE', Validators.required]
        });

        // Listen for role changes to update permissions
        this.employeeForm.get('user.roleId')?.valueChanges.subscribe(roleId => {
            if (roleId) {
                this.onRoleSelected(roleId);
            }
        });
    }

    onRoleSelected(roleId: string): void {
        this.roleService.getRole(roleId).subscribe(role => {
            if (role && role.permissions) {
                // Extract permission IDs from the role's permissions
                const permissionIds = role.permissions.map(permission => permission.id);

                // Update the additionalPermissionIds form control with the role's permissions
                this.employeeForm.get('user.additionalPermissionIds')?.setValue(permissionIds);

                // Store for UI reference
                this.selectedPermissionIds = permissionIds;

                // Update the tree selection state
                this.updateTreeSelectionState(permissionIds);
            }
        });
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
        // Extract the permission IDs from the selected nodes
        const permissionIds = this.selectedPermissions.map(node => node.key as string);

        // Update the form control with the current selected permission IDs
        this.employeeForm.get('user.additionalPermissionIds')?.setValue(this.selectedPermissionIds);
    }

    onSubmit(): void {
        if (this.employeeForm.invalid) {
            return;
        }

        this.loading = true;
        const formValue = this.employeeForm.value;

        // Format date values
        if (formValue.user.dateOfBirth) {
            formValue.user.dateOfBirth = formValue.user.dateOfBirth.toISOString().split('T')[0];
        }

        if (formValue.hiringDate) {
            formValue.hiringDate = formValue.hiringDate.toISOString().split('T')[0];
        }

        // Create the employee data object according to the new structure
        const employeeData = {
            user: {
                firstname: formValue.user.firstname,
                lastname: formValue.user.lastname,
                gender: formValue.user.gender,
                dateOfBirth: formValue.user.dateOfBirth,
                email: formValue.user.email,
                password: formValue.user.password,
                roleId: formValue.user.roleId,
                additionalPermissionIds: formValue.user.additionalPermissionIds || [],
                photo: formValue.user.photo
            },
            role: formValue.user.roleId, // Use the roleId from the user form group
            centerId: formValue.centerId,
            hiringDate: formValue.hiringDate,
            wage: formValue.wage,
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
