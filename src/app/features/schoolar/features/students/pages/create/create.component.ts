import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService, SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RippleModule} from 'primeng/ripple';
import {CalendarModule} from 'primeng/calendar';
import {Store} from "@ngrx/store";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {CenterActions} from "../../../../../../core/store/corporate/center/centers.actions";
import {selectAllCenters} from "../../../../../../core/store/corporate/center/centers.selector";
import {selectAllLevels} from "../../../../../../core/store/schoolar/level/level.selector";
import {distinctUntilChanged, filter, Observable, Subject, takeUntil} from "rxjs";
import {
    selectStudentAnyError,
    selectStudentAnyLoading,
    selectCreateStudentSuccess
} from "../../../../../../core/store/schoolar/students/students.selectors";
import {StudentsActions} from "../../../../../../core/store/schoolar/students/students.actions";
import {ToastModule} from "primeng/toast";

@Component({
    selector: 'app-student-create',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        DropdownModule,
        FileUploadModule,
        InputTextareaModule,
        InputGroupModule,
        InputGroupAddonModule,
        RadioButtonModule,
        CheckboxModule,
        CardModule,
        CalendarModule,
        ToastModule
    ],
    templateUrl: './create.component.html',
    providers: [MessageService]
})
export class CreateComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    loading$!: Observable<boolean>

    errors$!: Observable<any>;

    studentForm!: FormGroup;

    createSuccess$!: Observable<boolean>;

    levels: any[] = [];

    centers: SelectItem[] = [];

    genderOptions: SelectItem[] = [
        {label: 'Masculino', value: 'MALE'},
        {label: 'Femenino', value: 'FEMALE'}
    ];

    statusOptions: SelectItem[] = [
        {label: 'Activo', value: 'ACTIVE'},
        {label: 'Inactivo', value: 'INACTIVE'}
    ];

    constructor(private fb: FormBuilder, private store: Store, private messageService: MessageService) {
        this.createForm();
        this.initializeObservables();
        this.subscribeToStateChanges();
    }


    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnInit() {
        this.store.dispatch(LevelActions.loadLevels())
        this.store.dispatch(CenterActions.loadCenters())
    }


    onPhotoSelect(event: any) {
        const file = event.files[0];
        if (file) {
            this.studentForm.get('personalData.photo')?.setValue(file);
        }
    }

    createForm() {
        this.studentForm = this.fb.group({
            personalData: this.fb.group({
                identificationNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
                firstname: ['', [Validators.required, Validators.minLength(2)]],
                lastname: ['', [Validators.required, Validators.minLength(2)]],
                phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
                gender: ['', [Validators.required]],
                address: ['', [Validators.required, Validators.minLength(5)]],
                dateOfBirth: [null, [Validators.required]],
                email: ['', [Validators.email]],
                photo: [null],
                password: ['Root.dev@180404', [Validators.minLength(6)]],
            }),
            enrollmentData: this.fb.group({
                centerId: [null, [Validators.required]],
                levelId: [null, [Validators.required]],
                status: ['ACTIVE'],
                observations: [''],
            })
        });
    }

    saveStudent() {
        if (this.studentForm.valid) {
            const formData = this.studentForm.value;
            let studentData = {...formData.personalData, ...formData.enrollmentData};

            this.store.dispatch(StudentsActions.createStudent({student: studentData}));
        } else {
            // Mark all fields as touched to trigger validation messages
            this.markFormGroupTouched(this.studentForm);
            this.messageService.add({
                severity: 'warn',
                summary: 'Formulário Inválido',
                detail: 'Por favor, corrija os erros no formulário antes de continuar.',
                life: 5000
            });
        }
    }

    private initializeObservables() {
        this.errors$ = this.store.select(selectStudentAnyError);
        this.loading$ = this.store.select(selectStudentAnyLoading);
        this.createSuccess$ = this.store.select(selectCreateStudentSuccess);
    }

    private subscribeToStateChanges() {
        // Subscribe to centers data
        this.store.select(selectAllCenters)
            .pipe(takeUntil(this.destroy$))
            .subscribe(centers => {
                this.centers = centers.map(center => ({
                    label: center.name,
                    value: center.id
                }));
            });

        // Subscribe to levels data
        this.store.select(selectAllLevels)
            .pipe(takeUntil(this.destroy$))
            .subscribe(levels => {
                this.levels = levels.map(level => ({
                    label: level.name,
                    value: level.id
                }));
            });

        // Subscribe to create success state
        this.createSuccess$
            .pipe(
                takeUntil(this.destroy$),
                filter(success => success === true),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.showSuccessToast();
                this.resetForm();
            });

        // Subscribe to errors
        this.errors$
            .pipe(
                takeUntil(this.destroy$),
                filter(error => !!error)
            )
            .subscribe(error => {
                this.showErrorToast(error);
            });
    }


    // Helper method to mark all controls in a form group as touched
    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }


    // Helper method to get all form validation errors (for debugging)
    private getFormValidationErrors() {
        const errors: any = {};

        Object.keys(this.studentForm.controls).forEach(key => {
            const controlErrors = this.studentForm.get(key)?.errors;
            if (controlErrors) {
                errors[key] = controlErrors;
            }

            // Check nested form groups
            const nestedGroup = this.studentForm.get(key);
            if (nestedGroup instanceof FormGroup) {
                Object.keys(nestedGroup.controls).forEach(nestedKey => {
                    const nestedControlErrors = nestedGroup.get(nestedKey)?.errors;
                    if (nestedControlErrors) {
                        errors[`${key}.${nestedKey}`] = nestedControlErrors;
                    }

                    // Check for deeper nesting (like termsAccepted)
                    const deeperGroup = nestedGroup.get(nestedKey);
                    if (deeperGroup instanceof FormGroup) {
                        Object.keys(deeperGroup.controls).forEach(deeperKey => {
                            const deeperErrors = deeperGroup.get(deeperKey)?.errors;
                            if (deeperErrors) {
                                errors[`${key}.${nestedKey}.${deeperKey}`] = deeperErrors;
                            }
                        });
                    }
                });
            }
        });

        return errors;
    }

    // Helper method to check if a specific field has errors
    hasFieldError(fieldPath: string): boolean {
        const field = this.studentForm.get(fieldPath);
        return !!(field && field.invalid && field.touched);
    }

    // Helper method to get error message for a specific field
    getFieldError(fieldPath: string): string {
        const field = this.studentForm.get(fieldPath);

        if (field && field.errors && field.touched) {
            if (field.errors['required']) {
                return 'Este campo é obrigatório';
            }
            if (field.errors['email']) {
                return 'Por favor, insira um e-mail válido';
            }
            if (field.errors['minlength']) {
                return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
            }
        }

        return '';
    }

    private showSuccessToast() {
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Estudante criado com sucesso.',
            life: 4000
        });
    }

    private showErrorToast(error: any) {
        const errorMessage = error || 'Erro ao criar estudante. Tente novamente.';

        this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: errorMessage,
            life: 6000
        });
    }

    private resetForm() {
        this.studentForm.reset();
        // Reset to default values
        this.studentForm.patchValue({
            personalData: {
                password: 'Root.dev@180404'
            },
            enrollmentData: {
                status: 'ACTIVE'
            }
        });
        this.studentForm.markAsUntouched();
        this.studentForm.markAsPristine();
    }
}
