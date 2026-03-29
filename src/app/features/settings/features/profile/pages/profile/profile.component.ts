import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable, Subject, take, takeUntil} from 'rxjs';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FileUploadModule} from 'primeng/fileupload';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {DividerModule} from 'primeng/divider';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';

import {User} from '../../../../../../core/models/auth/user';
import {Permission} from '../../../../../../core/models/auth/permission';
import {authFeature} from '../../../../../../core/store/auth/auth.reducers';
import {authActions} from '../../../../../../core/store/auth/auth.actions';
import {UserProfileService} from '../../../../../../core/services/user-profile.service';
import {severtyType} from "../../../../../schoolar/features/lessons/components/bulk-booking/bulk-booking.component";

interface PermissionGroupView {
    key: PermissionCategory;
    label: string;
    colorClass: string;
    permissions: Permission[];
}

type PermissionCategory = 'read' | 'write' | 'delete' | 'manage';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ToastModule,
        CardModule,
        InputTextModule,
        ButtonModule,
        FileUploadModule,
        AvatarModule,
        BadgeModule,
        DividerModule,
        ProgressSpinnerModule,
        DropdownModule,
        CalendarModule
    ],
    templateUrl: 'profile.component.html',
    styleUrl: 'profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
    profileForm: FormGroup;
    currentUser$: Observable<User | null>;
    loading$: Observable<boolean>;
    showChangePasswordDialog = false;

    private destroy$ = new Subject<void>();

    genderOptions = [
        {label: 'Male', value: 'MALE'},
        {label: 'Female', value: 'FEMALE'}
    ];

    permissionSearch = '';
    filteredPermissionGroups: PermissionGroupView[] = [];
    totalPermissionsCount = 0;
    visiblePermissionsCount = 0;

    private allPermissions: Permission[] = [];
    private readonly permissionGroupMeta: Record<PermissionCategory, Omit<PermissionGroupView, 'permissions'>> = {
        read: {key: 'read', label: 'Leitura', colorClass: 'perm-read'},
        write: {key: 'write', label: 'Escrita & Atualizacao', colorClass: 'perm-write'},
        delete: {key: 'delete', label: 'Eliminacao', colorClass: 'perm-delete'},
        manage: {key: 'manage', label: 'Gestao & Relatorios', colorClass: 'perm-manage'}
    };
    private readonly permissionGroupOrder: PermissionCategory[] = ['read', 'write', 'delete', 'manage'];

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private messageService: MessageService,
        public userProfileService: UserProfileService
    ) {
        this.profileForm = this.createForm();
        this.currentUser$ = this.store.select(authFeature.selectUser);
        this.loading$ = this.store.select(authFeature.selectLoading);
    }

    ngOnInit(): void {
        // Load user profile on component
        this.store.dispatch(authActions.loadUserProfile());

        // Subscribe to current user changes and update form
        this.currentUser$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(user => {
            if (user) {
                this.updateForm(user);
                this.setPermissions(user.allPermissions || []);
            } else {
                this.setPermissions([]);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private createForm(): FormGroup {
        return this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            username: ['', [Validators.required, Validators.minLength(3)]],
            identificationNumber: [''],
            gender: [''],
            birthdate: [null]
        });
    }

    private updateForm(user: User): void {
        this.profileForm.patchValue({
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
            phone: user.phone || '',
            username: user.username,
            identificationNumber: user.identificationNumber || '',
            gender: user.gender,
            birthdate: user.birthdate ? new Date(user.birthdate) : null
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.profileForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    onSubmit(): void {
        if (this.profileForm.valid) {
            const formValue = this.profileForm.value;

            // Convert date to ISO string if present
            if (formValue.birthdate) {
                formValue.birthdate = formValue.birthdate.toISOString();
            }

            this.store.dispatch(authActions.updateUserProfile({userData: formValue}));

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully'
            });
        } else {
            this.markFormGroupTouched();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields correctly'
            });
        }
    }

    resetForm(): void {
        this.currentUser$.pipe(take(1)).subscribe(user => {
            if (user) {
                this.updateForm(user);
            }
        });
    }

    onPhotoUpload(event: any): void {
        const file = event.files[0];
        if (file) {
            this.store.dispatch(authActions.updateUserPhoto({photoFile: file}));

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Photo updated successfully'
            });
        }
    }

    getStatusSeverity(status: string): severtyType {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'warn';
            case 'SUSPENDED':
                return 'danger';
            case 'PENDING':
                return 'info';
            default:
                return 'info';
        }
    }

    getVerificationLabel(isVerified?: boolean): string {
        return isVerified ? 'Confirmado' : 'Nao confirmado';
    }

    onPermissionSearch(searchTerm: string): void {
        this.permissionSearch = searchTerm;
        this.refreshPermissionGroups();
    }

    trackByPermission(_: number, permission: Permission): string {
        return permission.id;
    }

    trackByPermissionGroup(_: number, group: PermissionGroupView): string {
        return group.key;
    }

    private setPermissions(permissions: Permission[]): void {
        this.allPermissions = [...permissions];
        this.totalPermissionsCount = permissions.length;
        this.refreshPermissionGroups();
    }

    private refreshPermissionGroups(): void {
        const normalizedSearch = this.permissionSearch.trim().toLowerCase();
        const grouped = this.permissionGroupOrder.reduce((acc, groupKey) => {
            acc[groupKey] = [];
            return acc;
        }, {} as Record<PermissionCategory, Permission[]>);

        this.allPermissions
            .filter(permission => this.matchesPermissionSearch(permission, normalizedSearch))
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(permission => {
                grouped[this.categorizePermission(permission)].push(permission);
            });

        this.filteredPermissionGroups = this.permissionGroupOrder
            .map(groupKey => ({
                ...this.permissionGroupMeta[groupKey],
                permissions: grouped[groupKey]
            }))
            .filter(group => group.permissions.length > 0);

        this.visiblePermissionsCount = this.filteredPermissionGroups.reduce(
            (total, group) => total + group.permissions.length,
            0
        );
    }

    private matchesPermissionSearch(permission: Permission, normalizedSearch: string): boolean {
        if (!normalizedSearch) {
            return true;
        }

        const searchableValues = [permission.name, permission.key, permission.description]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return searchableValues.includes(normalizedSearch);
    }

    private categorizePermission(permission: Permission): PermissionCategory {
        const normalized = `${permission.key} ${permission.name}`.toLowerCase();

        if (this.hasAnyKeyword(normalized, ['delete', 'remove', 'destroy', 'excluir', 'eliminar', 'apagar'])) {
            return 'delete';
        }

        if (this.hasAnyKeyword(normalized, ['create', 'update', 'edit', 'write', 'criar', 'atualizar', 'editar', 'escrever'])) {
            return 'write';
        }

        if (this.hasAnyKeyword(normalized, ['manage', 'admin', 'report', 'audit', 'workflow', 'config', 'gest', 'relatorio', 'auditoria'])) {
            return 'manage';
        }

        return 'read';
    }

    private hasAnyKeyword(value: string, keywords: string[]): boolean {
        return keywords.some(keyword => value.includes(keyword));
    }

    private markFormGroupTouched(): void {
        Object.keys(this.profileForm.controls).forEach(key => {
            const control = this.profileForm.get(key);
            control?.markAsTouched();
        });
    }
}
