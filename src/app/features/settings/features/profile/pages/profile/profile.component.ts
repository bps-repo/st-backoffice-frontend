import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

import { User } from '../../../../../../core/models/auth/user';
import { authFeature } from '../../../../../../core/store/auth/auth.reducers';
import { authActions } from '../../../../../../core/store/auth/auth.actions';
import { UserProfileService } from '../../../../../../core/services/user-profile.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ToastModule,
        CardModule,
        InputTextModule,
        InputTextareaModule,
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
        { label: 'Male', value: 'MALE' },
        { label: 'Female', value: 'FEMALE' },
        { label: 'Other', value: 'OTHER' }
    ];

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
                console.log("User ffrom profile", user);

                this.updateForm(user);
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

            this.store.dispatch(authActions.updateUserProfile({ userData: formValue }));

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
        this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
            if (user) {
                this.updateForm(user);
            }
        });
    }

    onPhotoUpload(event: any): void {
        const file = event.files[0];
        if (file) {
            this.store.dispatch(authActions.updateUserPhoto({ photoFile: file }));

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Photo updated successfully'
            });
        }
    }

    getStatusSeverity(status: string): "success" | "info" | "warning" | "danger" | null {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'warning';
            case 'SUSPENDED':
                return 'danger';
            case 'PENDING':
                return 'info';
            default:
                return 'info';
        }
    }

    private markFormGroupTouched(): void {
        Object.keys(this.profileForm.controls).forEach(key => {
            const control = this.profileForm.get(key);
            control?.markAsTouched();
        });
    }
}
