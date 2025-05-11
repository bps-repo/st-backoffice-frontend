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
import {Subject, takeUntil} from 'rxjs';
import {
    authFeature,
    AuthState,
} from '../../../../core/store/auth/reducers/auth.reducers';
import {authActions} from '../../../../core/store/auth/actions/auth.actions';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

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
    isSubmitting = false;
    showAlert = false;
    errorMessage: string = '';
    currentYear: number = new Date().getFullYear();

    private unsubscribe$ = new Subject<void>();

    constructor(
        private store: Store<AuthState>,
        private fb: FormBuilder,
        private detectChange: ChangeDetectorRef,
        private renderer: Renderer2,
        private el: ElementRef
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });

        this.store
            .select(authFeature.selectError)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((error) => {
                if (error) {
                    this.isSubmitting = false;
                    this.showAlert = true;

                    this.detectChange.detectChanges();

                    const errorCode = Number(error);

                    const errorMessage =
                        errorCode === 401 || errorCode === 403
                            ? 'Email ou senha incorretos. Tente novamente.'
                            : 'Ocorreu uma falha ao tentar fazer login. Se o problema persistir, entre em contato com o administrador.';

                    this.displayErrorMessage(errorMessage);

                    setTimeout(() => {
                        this.dismissError();
                        this.detectChange.detectChanges();
                    }, 7000);
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

        this.isSubmitting = true;
        this.detectChange.detectChanges();

        const { email, password } = this.loginForm.value;

        this.store.dispatch(authActions.login({ email, password }));
    }

    dismissError() {
        this.store.dispatch(authActions.clearError());
        this.showAlert = false;
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
    }
}
