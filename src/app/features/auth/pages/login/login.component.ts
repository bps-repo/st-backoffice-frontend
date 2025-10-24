import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    ElementRef,
    Renderer2,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {Store} from '@ngrx/store';
import {combineLatest, map, Observable, of, Subject, takeUntil} from 'rxjs';
import {
    authFeature,
} from '../../../../core/store/auth/auth.reducers';
import {
    AuthState,
} from '../../../../core/store/auth/auth.state';
import {authActions} from '../../../../core/store/auth/auth.actions';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import * as authSelectors from '../../../../core/store/auth/auth.selectors';
import {ErrorMessageService, ApiError} from '../../../../core/services/error-message.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule]
})
export class LoginComponent implements OnDestroy {
    loginForm: FormGroup;
    hidePassword = true;
    isSubmitting : Observable<boolean> = of(false);
    showAlert = false;
    errorMessage: string = '';
    errorSeverity: 'error' | 'warning' | 'info' = 'error';
    shouldShowRetry = false;
    retryDelay = 0;
    currentYear: number = new Date().getFullYear();

    private unsubscribe$ = new Subject<void>();
    private retryTimer?: number;

    constructor(
        private store: Store<AuthState>,
        private fb: FormBuilder,
        private detectChange: ChangeDetectorRef,
        private renderer: Renderer2,
        private el: ElementRef,
        private errorMessageService: ErrorMessageService
    ) {
        this.isSubmitting = combineLatest([
            this.store.select(authSelectors.selectAuthLoading),
            this.store.select(authSelectors.selectAuthLoadUserProfile)
        ]).pipe(map(([loading, loadUserProfile]) => loading || loadUserProfile));

        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        this.store
            .select(authFeature.selectError)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((error: ApiError | null) => {
                if (error) {
                    this.showAlert = true;

                    // Get user-friendly error message
                    this.errorMessage = this.errorMessageService.getErrorMessage(error);
                    this.errorSeverity = this.errorMessageService.getErrorSeverity(error);
                    this.shouldShowRetry = this.errorMessageService.shouldShowRetry(error);
                    this.retryDelay = this.errorMessageService.getRetryDelay(error);

                    // Start countdown timer if retry is available
                    if (this.shouldShowRetry && this.retryDelay > 0) {
                        this.startRetryCountdown();
                    }

                    this.detectChange.detectChanges();

                    // Auto-dismiss error after 7 seconds (unless it's a retry-able error)
                    if (!this.shouldShowRetry) {
                        setTimeout(() => {
                            this.dismissError();
                            this.detectChange.detectChanges();
                        }, 7000);
                    }
                }
            });
    }

    togglePasswordVisibility() {
        this.hidePassword = !this.hidePassword;
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            return;
        }

        this.detectChange.detectChanges();

        const { email, password } = this.loginForm.value;

        this.store.dispatch(authActions.login({ email, password }));
    }

    dismissError() {
        this.store.dispatch(authActions.clearError());
        this.showAlert = false;
        this.shouldShowRetry = false;
        this.retryDelay = 0;
        this.clearRetryTimer();
    }

    retryLogin() {
        this.dismissError();
        this.onSubmit();
    }

    private startRetryCountdown() {
        this.clearRetryTimer();
        this.retryTimer = window.setInterval(() => {
            this.retryDelay--;
            this.detectChange.detectChanges();

            if (this.retryDelay <= 0) {
                this.clearRetryTimer();
            }
        }, 1000);
    }

    private clearRetryTimer() {
        if (this.retryTimer) {
            clearInterval(this.retryTimer);
            this.retryTimer = undefined;
        }
    }

    private displayErrorMessage(err: string): void {
        const alertElement = this.el.nativeElement.querySelector('#alert');
        const messageElement = this.el.nativeElement.querySelector('#message');

        if (alertElement && messageElement) {
            this.renderer.setProperty(messageElement, 'textContent', err);
            this.renderer.addClass(alertElement, 'show');
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.clearRetryTimer();
    }
}
