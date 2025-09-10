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
  template: `
    <div class="profile-container">
      <p-toast></p-toast>

      <div class="grid">
        <!-- Profile Header -->
        <div class="col-12">
          <p-card>
            <ng-template pTemplate="header">
              <div class="profile-header">
                <div class="profile-avatar-section">
                  <p-avatar
                    [image]="userProfileService.getPhotoUrl()"
                    [label]="userProfileService.getInitials()"
                    size="xlarge"
                    shape="circle"
                    class="profile-avatar">
                  </p-avatar>
                  <div class="avatar-actions">
                    <p-fileUpload
                      mode="basic"
                      name="photo"
                      accept="image/*"
                      [maxFileSize]="5000000"
                      [auto]="true"
                      (onUpload)="onPhotoUpload($event)"
                      chooseLabel="Change Photo"
                      chooseIcon="pi pi-camera"
                      class="photo-upload">
                    </p-fileUpload>
                  </div>
                </div>
                <div class="profile-info">
                  <h1 class="profile-name">{{ userProfileService.getFullName() }}</h1>
                  <p class="profile-username">{{ currentUser$ | async | json }}</p>
                  <div class="profile-badges">
                    <p-badge
                      [value]="(currentUser$ | async)?.role?.name || ''"
                      severity="info">
                    </p-badge>
                    <p-badge
                      [value]="(currentUser$ | async)?.accountStatus || ''"
                      [severity]="getStatusSeverity((currentUser$ | async)?.accountStatus || '')">
                    </p-badge>
                  </div>
                </div>
              </div>
            </ng-template>
          </p-card>
        </div>

        <!-- Profile Form -->
        <div class="col-12 md:col-8">
          <p-card header="Profile Information">
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="grid">
                <div class="col-12 md:col-6">
                  <label for="firstName">First Name</label>
                  <input
                    pInputText
                    id="firstName"
                    formControlName="firstName"
                    placeholder="Enter first name"
                    [class.ng-invalid]="isFieldInvalid('firstName')">
                  <small
                    class="p-error"
                    *ngIf="isFieldInvalid('firstName')">
                    First name is required
                  </small>
                </div>

                <div class="col-12 md:col-6">
                  <label for="lastName">Last Name</label>
                  <input
                    pInputText
                    id="lastName"
                    formControlName="lastName"
                    placeholder="Enter last name"
                    [class.ng-invalid]="isFieldInvalid('lastName')">
                  <small
                    class="p-error"
                    *ngIf="isFieldInvalid('lastName')">
                    Last name is required
                  </small>
                </div>

                <div class="col-12 md:col-6">
                  <label for="email">Email</label>
                  <input
                    pInputText
                    id="email"
                    formControlName="email"
                    placeholder="Enter email"
                    type="email"
                    [class.ng-invalid]="isFieldInvalid('email')">
                  <small
                    class="p-error"
                    *ngIf="isFieldInvalid('email')">
                    Valid email is required
                  </small>
                </div>

                <div class="col-12 md:col-6">
                  <label for="phone">Phone</label>
                  <input
                    pInputText
                    id="phone"
                    formControlName="phone"
                    placeholder="Enter phone number">
                </div>

                <div class="col-12 md:col-6">
                  <label for="username">Username</label>
                  <input
                    pInputText
                    id="username"
                    formControlName="username"
                    placeholder="Enter username"
                    [class.ng-invalid]="isFieldInvalid('username')">
                  <small
                    class="p-error"
                    *ngIf="isFieldInvalid('username')">
                    Username is required
                  </small>
                </div>

                <div class="col-12 md:col-6">
                  <label for="identificationNumber">Identification Number</label>
                  <input
                    pInputText
                    id="identificationNumber"
                    formControlName="identificationNumber"
                    placeholder="Enter identification number">
                </div>

                <div class="col-12 md:col-6">
                  <label for="gender">Gender</label>
                  <p-dropdown
                    id="gender"
                    formControlName="gender"
                    [options]="genderOptions"
                    placeholder="Select gender"
                    optionLabel="label"
                    optionValue="value">
                  </p-dropdown>
                </div>

                <div class="col-12 md:col-6">
                  <label for="birthdate">Birth Date</label>
                  <p-calendar
                    id="birthdate"
                    formControlName="birthdate"
                    placeholder="Select birth date"
                    [showIcon]="true"
                    dateFormat="dd/mm/yy">
                  </p-calendar>
                </div>
              </div>

              <div class="form-actions">
                <p-button
                  type="submit"
                  label="Update Profile"
                  icon="pi pi-save"
                  [loading]="(loading$ | async) || false"
                  [disabled]="profileForm.invalid">
                </p-button>
                <p-button
                  type="button"
                  label="Reset"
                  icon="pi pi-refresh"
                  severity="secondary"
                  (click)="resetForm()">
                </p-button>
              </div>
            </form>
          </p-card>
        </div>

        <!-- Account Information -->
        <div class="col-12 md:col-4">
          <p-card header="Account Information">
            <div class="account-info">
              <div class="info-item">
                <label>Account Status</label>
                <p-badge
                  [value]="(currentUser$ | async)?.accountStatus || ''"
                  [severity]="getStatusSeverity((currentUser$ | async)?.accountStatus || '')">
                </p-badge>
              </div>

              <div class="info-item">
                <label>Email Verified</label>
                <p-badge
                  [value]="(currentUser$ | async)?.emailVerified ? 'Yes' : 'No'"
                  [severity]="(currentUser$ | async)?.emailVerified ? 'success' : 'warning'">
                </p-badge>
              </div>

              <div class="info-item">
                <label>Phone Verified</label>
                <p-badge
                  [value]="(currentUser$ | async)?.phoneVerified ? 'Yes' : 'No'"
                  [severity]="(currentUser$ | async)?.phoneVerified ? 'success' : 'warning'">
                </p-badge>
              </div>

              <div class="info-item">
                <label>Role</label>
                <span class="role-name">{{ (currentUser$ | async)?.role?.name || 'N/A' }}</span>
              </div>

              <div class="info-item">
                <label>Member Since</label>
                <span>{{ (currentUser$ | async)?.createdAt | date:'medium' }}</span>
              </div>
            </div>

            <p-divider></p-divider>

            <div class="account-actions">
              <p-button
                label="Change Password"
                icon="pi pi-key"
                severity="secondary"
                (click)="showChangePasswordDialog = true">
              </p-button>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 2rem;
    }

    .profile-avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      font-size: 3rem;
    }

    .avatar-actions {
      display: flex;
      gap: 0.5rem;
    }

    .photo-upload {
      width: 100%;
    }

    .profile-info {
      flex: 1;
    }

    .profile-name {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 600;
    }

    .profile-username {
      margin: 0 0 1rem 0;
      color: var(--text-color-secondary);
      font-size: 1.1rem;
    }

    .profile-badges {
      display: flex;
      gap: 0.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .account-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
    }

    .info-item label {
      font-weight: 500;
      color: var(--text-color-secondary);
    }

    .role-name {
      font-weight: 600;
      color: var(--primary-color);
    }

    .account-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .profile-avatar-section {
        order: 1;
      }

      .profile-info {
        order: 2;
      }
    }
  `]
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
