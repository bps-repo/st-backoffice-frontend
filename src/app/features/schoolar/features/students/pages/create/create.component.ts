import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject, takeUntil, combineLatest, debounceTime} from 'rxjs';
import {MenuItem, SelectItem, MessageService} from 'primeng/api';
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
import {StepsModule} from 'primeng/steps';
import {ToastModule} from 'primeng/toast';
import {
    PROVINCES,
    MUNICIPALITIES,
    ACADEMIC_BACKGROUNDS,
} from 'src/app/shared/constants/app';
import {CreateStudentRequest} from 'src/app/core/services/student.service';
import {StudentsActions} from 'src/app/core/store/schoolar/students/students.actions';
import {studentsFeature} from 'src/app/core/store/schoolar/students/students.reducers';
import {CenterActions} from 'src/app/core/store/corporate/center/centers.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import {map, Observable} from 'rxjs';

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
        StepsModule,
        ToastModule
    ],
    templateUrl: './create.component.html',
    providers: [MessageService]
})
export class CreateComponent implements OnInit, OnDestroy {
    activeIndex: number = 0;
    studentForm!: FormGroup;
    private destroy$ = new Subject<void>();

    // Loading and error states from store
    loading$ = this.store.select(studentsFeature.selectLoadingCreate);
    createError$ = this.store.select(studentsFeature.selectCreateError);

    // Real centers options (as SelectItem[]) derived from the centers store
    centersOptions$!: Observable<SelectItem[]>;

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private router: Router,
        private messageService: MessageService
    ) {
    }

    steps: MenuItem[] = [
        {label: 'Dados Pessoais'},
        {label: 'Dados institucional'},
        {label: 'Contato de Emergência'},
        {label: 'Observações'}
    ];


    provinces: SelectItem[] = PROVINCES;
    municipalities: SelectItem[] = MUNICIPALITIES;
    academicBackgrounds: SelectItem[] = ACADEMIC_BACKGROUNDS;

    genderOptions: SelectItem[] = [
        {label: 'Masculino', value: 'MALE'},
        {label: 'Femenino', value: 'FEMALE'}
    ];

    statusOptions: SelectItem[] = [
        {label: 'Activo', value: 'ACTIVE'},
        {label: 'Inactivo', value: 'INACTIVE'}
    ];

    ngOnInit() {
        this.initializeForm();
        this.initializeCentersDropdown();
        this.subscribeToFormSuccess();

        this.activeIndex = 0;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeForm() {
        this.studentForm = this.fb.group({
            // Personal Data
            firstname: ['', [Validators.required, Validators.minLength(2)]],
            lastname: ['', [Validators.required, Validators.minLength(2)]],
            gender: ['', Validators.required],
            identificationNumber: ['', [Validators.required, Validators.pattern(/[0-9]{9}[A-Z]{2}[0-9]{3}$/)]],
            birthdate: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            photo: [''],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
            province: ['', Validators.required],
            municipality: ['', Validators.required],
            academicBackground: ['', Validators.required],

            // Academic Data
            centerId: ['', Validators.required],

            // Emergency Contact
            emergencyContactName: ['', Validators.required],
            emergencyContactRelationship: [''],
            emergencyContactNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],

            // Notes
            notes: ['']
        });
    }

    private initializeCentersDropdown() {
        // Dispatch load centers and map to dropdown options from the store
        this.store.dispatch(CenterActions.loadCenters());
        this.centersOptions$ = this.store.select(CenterSelectors.selectAllCenters).pipe(
            map(centers => centers.map(c => ({ label: c.name, value: c.id } as SelectItem)))
        );
    }

    private subscribeToFormSuccess() {
        // Track successful creation by combining loading and error states
        combineLatest([
            this.store.select(studentsFeature.selectLoadingCreate),
            this.store.select(studentsFeature.selectCreateError)
        ]).pipe(
            debounceTime(1000),
            takeUntil(this.destroy$)
        ).subscribe(([loading, error]) => {
            // If loading finished and form is disabled
            if (!loading && this.studentForm.disabled) {
                if (!error) {
                    // Success - show toast and navigate
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Aluno criado com sucesso!'
                    });
                    this.router.navigate(['/schoolar/students']).then();
                } else {
                    // Error occurred during creation
                    console.error('Student creation error:', error);

                    // Show error toast
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: `Erro ao criar aluno: ${error}`
                    });

                    // Re-enable form on error
                    this.studentForm.enable();
                }
            }
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.activeIndex++;
        }
    }

    prevStep() {
        this.activeIndex--;
    }

    validateCurrentStep(): boolean {
        const stepFieldsMap = {
            0: ['firstname', 'lastname', 'gender', 'birthdate', 'email', 'phone', 'province', 'municipality', 'academicBackground'], // Personal Data
            1: ['centerId', 'status', 'enrollmentDate'], // Academic Data
            2: ['emergencyContactName', 'emergencyContactNumber'], // Emergency Contact
            3: [] // Notes - no required fields
        };

        const currentStepFields = stepFieldsMap[this.activeIndex as keyof typeof stepFieldsMap];

        for (const field of currentStepFields) {
            const control = this.studentForm.get(field);
            if (control && control.invalid) {
                control.markAsTouched();
                console.log(`Invalid field: ${field}`, control.errors);
                return false;
            }
        }

        return true;
    }

    // Helper method to check if a field has errors and is touched
    hasFieldError(fieldName: string): boolean {
        const field = this.studentForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    // Helper method to get field error message
    getFieldError(fieldName: string): string {
        const field = this.studentForm.get(fieldName);
        if (field && field.errors && field.touched) {
            const errors = field.errors;
            if (errors['required']) return `${fieldName} é obrigatório`;
            if (errors['email']) return 'Email inválido';
            if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
            if (errors['pattern']) return 'Formato inválido';
        }
        return '';
    }

    goToStep(index: number) {
        // Only allow going to a step if all previous steps are valid
        if (index < this.activeIndex || this.validateStepsBeforeIndex(index)) {
            this.activeIndex = index;
        }
    }

    validateStepsBeforeIndex(targetIndex: number): boolean {
        // Validate all steps before the target index
        for (let i = 0; i < targetIndex; i++) {
            this.activeIndex = i;
            if (!this.validateCurrentStep()) {
                return false;
            }
        }
        return true;
    }

    saveStudent() {
        // Mark all fields as touched to show validation errors
        this.studentForm.markAllAsTouched();

        // Validate all steps before saving
        if (this.studentForm.valid && this.validateStepsBeforeIndex(this.steps.length)) {
            // Disable form while submitting
            this.studentForm.disable();

            // Convert form data to API payload format
            const formValue = this.studentForm.value;
            const createStudentRequest: CreateStudentRequest = {
                identificationNumber: formValue.identificationNumber,
                firstname: formValue.firstname,
                lastname: formValue.lastname,
                gender: formValue.gender,
                birthdate: this.formatDate(formValue.birthdate),
                email: formValue.email,
                password: formValue.password || 'DefaultPassword123', // Default password if not provided
                photo: formValue.photo,
                phone: formValue.phone,
                centerId: formValue.centerId,
                emergencyContactNumber: formValue.emergencyContactNumber,
                emergencyContactName: formValue.emergencyContactName,
                emergencyContactRelationship: formValue.emergencyContactRelationship,
                academicBackground: formValue.academicBackground,
                province: formValue.province,
                municipality: formValue.municipality,
                notes: formValue.notes
            };

            console.log('Saving student:', createStudentRequest);
            this.resetForm()
            // Dispatch action to create student via NgRx
            this.store.dispatch(StudentsActions.createStudentWithRequest({request: createStudentRequest}))
        } else {
            console.log('Form is invalid', this.studentForm.errors);
            // Find first invalid step
            const firstInvalidStep = this.findFirstInvalidStep();
            if (firstInvalidStep !== -1) {
                this.activeIndex = firstInvalidStep;
            }
        }
    }

    private findFirstInvalidStep(): number {
        const stepFieldsMap = {
            0: ['firstname', 'lastname', 'gender', 'birthdate', 'identificationNumber', 'email', 'phone', 'province', 'municipality', 'academicBackground'],
            1: ['centerId', 'status'],
            2: ['emergencyContactName', 'emergencyContactNumber'],
            3: []
        };

        for (let step = 0; step < 4; step++) {
            const fields = stepFieldsMap[step as keyof typeof stepFieldsMap];
            for (const field of fields) {
                const control = this.studentForm.get(field);
                if (control && control.invalid) {
                    return step;
                }
            }
        }
        return -1;
    }

    private resetForm() {
        this.studentForm.reset();
        this.activeIndex = 0;
    }

    // Helper method to format dates to YYYY-MM-DD format
    private formatDate(date: Date | null): string {
        if (!date) return '';

        return date.toISOString().split('T')[0];
    }
}
