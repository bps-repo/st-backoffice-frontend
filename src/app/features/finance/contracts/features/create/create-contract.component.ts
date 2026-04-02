import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy, inject} from '@angular/core';
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
import {RadioButtonModule} from 'primeng/radiobutton';
import {RippleModule} from 'primeng/ripple';
import {CalendarModule} from 'primeng/calendar';
import {StepsModule} from 'primeng/steps';
import {ToastModule} from 'primeng/toast';
import {
    ACADEMIC_BACKGROUNDS,
} from 'src/app/shared/constants/app';
import {StudentsActions} from 'src/app/core/store/schoolar/students/students.actions';
import {studentsFeature} from 'src/app/core/store/schoolar/students/students.reducers';
import {CenterActions} from 'src/app/core/store/corporate/center/centers.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import {map, Observable, of} from 'rxjs';
import {RenewContractComponent} from "../renew/renew-contract.component";
import {LocationActions} from 'src/app/core/store/location/location.actions';
import * as LocationSelectors from 'src/app/core/store/location/location.selectors';
import {selectCreatedStudentId} from "../../../../../core/store/schoolar/students/students.selectors";
import {CanComponentDeactivate} from "../../../../../core/guards/pending-changes.guard";
import {contractsFeature} from 'src/app/core/store/corporate/contracts/contracts.feature';
import {CreateStudentRequest} from "../../../../../core/models/academic/students/create-student-request";
import {ShowToastErrorService} from "../../../../../shared/services/show-toast-error-service";
import {Textarea} from "primeng/textarea";

@Component({
    selector: 'finance-contracts-create',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        DropdownModule,
        FileUploadModule,
        InputGroupModule,
        InputGroupAddonModule,
        RadioButtonModule,
        CheckboxModule,
        CardModule,
        CalendarModule,
        StepsModule,
        ToastModule,
        RenewContractComponent,
        Textarea
    ],
    templateUrl: './create-contract.component.html',
    styleUrls: ['./create-contract.component.scss'],
    providers: [MessageService]
})
export class CreateContractComponent implements OnInit, OnDestroy, CanComponentDeactivate {
    private fb = inject(FormBuilder);
    private store = inject(Store);
    private router = inject(Router);
    private messageService = inject(MessageService);

    activeIndex: number = 0;
    studentForm!: FormGroup;
    private destroy$ = new Subject<void>();

    // Track if student was successfully created
    createdStudentId: string | null = null;
    isStudentCreated: boolean = false;

    successCreate$ = this.store.select(contractsFeature.selectSuccessCreate);

    // Loading and error states from store
    loading$ = this.store.select(studentsFeature.selectLoadingCreate)
    createError$ = this.store.select(studentsFeature.selectCreateError);

    // Real centers options (as SelectItem[]) derived from the centers store
    centersOptions$!: Observable<SelectItem[]>;

    steps: MenuItem[] = [
        {label: 'Dados Pessoais'},
        {label: 'Contato de Emergência e Observações'},
        {label: 'Gestão contratual'}
    ];

    provinces$!: Observable<SelectItem[]>;
    municipalities$!: Observable<SelectItem[]>;
    academicBackgrounds: SelectItem[] = ACADEMIC_BACKGROUNDS;
    loadingProvinces$!: Observable<boolean>;
    loadingMunicipalities$!: Observable<boolean>;

    genderOptions: SelectItem[] = [
        {label: 'Masculino', value: 'MALE'},
        {label: 'Femenino', value: 'FEMALE'}
    ];

    private readonly LAST_STEP_INDEX = 2;

    constructor() {
        this.successCreate$.subscribe(success => {
            if (success) {
                this.studentForm.reset();
                this.studentForm.disable();
                this.activeIndex = 0;
                this.router.navigate(['/finance/contracts']).then();
            } else {
                ShowToastErrorService.showToastError("Erro ao criar contrato", {message: "Ocorreu um erro, tente novamente"}, this.messageService)
            }
        });

        this.createError$.subscribe(error => {
            this.studentForm.enable();
            ShowToastErrorService.showToastError("Erro ao criar contrato", error, this.messageService)
        })
    }

    ngOnInit() {
        this.initializeForm();
        this.initializeCentersDropdown();
        this.initializeLocationSelectors();
        this.loadProvinces();
        this.subscribeToProvinceChanges();
        this.subscribeToStudentCreation();
        this.activeIndex = 0;

        // Prevent navigation away if student is created but no contract
        this.setupNavigationGuard();

        // Listen for created student ID
        this.store.select(selectCreatedStudentId).subscribe(studentId => {
            if (studentId) {
                this.isStudentCreated = true;
                this.createdStudentId = studentId;
                this.activeIndex = 2;
            }
        })
    }

    canDeactivate(): boolean {
        if (this.studentForm.dirty) {
            return confirm('⚠️ Tens mudanças não salvados. Tens certeza que queres sair?');
        }
        return true;
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
            birthdate: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['StudentPassword123', [Validators.minLength(6)]],
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
        this.store.dispatch(CenterActions.loadCenters());
        this.centersOptions$ = this.store.select(CenterSelectors.selectAllCenters).pipe(
            map(centers => centers.map(c => ({label: c.name, value: c.id} as SelectItem)))
        );
    }

    private initializeLocationSelectors() {
        // Initialize provinces observable
        this.provinces$ = this.store.select(LocationSelectors.selectAllProvinces).pipe(
            map(provinces => provinces.map(p => ({label: p.name, value: p.name} as SelectItem)))
        );

        // Initialize loading states
        this.loadingProvinces$ = this.store.select(LocationSelectors.selectProvincesLoading);

        // Subscribe to province errors
        this.store.select(LocationSelectors.selectProvincesError).pipe(
            takeUntil(this.destroy$)
        ).subscribe(error => {
            if (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar províncias'
                });
            }
        });
    }

    private loadProvinces() {
        this.store.dispatch(LocationActions.loadProvinces());
    }

    private subscribeToProvinceChanges() {
        this.studentForm.get('province')?.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(provinceName => {
            // Clear municipality when province changes
            this.studentForm.patchValue({municipality: ''});

            if (provinceName) {
                // Update municipalities selector for the selected province
                this.municipalities$ = this.store.select(LocationSelectors.selectMunicipalitiesByProvinceId(provinceName)).pipe(
                    map(municipalities => municipalities.map(m => ({
                        label: m.name,
                        value: m.name.toLowerCase()
                    } as SelectItem)))
                );

                // Update loading state for the selected province
                this.loadingMunicipalities$ = this.store.select(LocationSelectors.selectMunicipalitiesLoadingByProvinceId(provinceName));

                // Subscribe to errors for this province
                this.store.select(LocationSelectors.selectMunicipalitiesErrorByProvinceId(provinceName)).pipe(
                    takeUntil(this.destroy$)
                ).subscribe(error => {
                    if (error) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao carregar municípios'
                        });
                    }
                });

                // Load municipalities
                this.loadMunicipalities(provinceName);
            } else {
                // Reset municipalities when province is cleared
                this.municipalities$ = of([]);
                this.loadingMunicipalities$ = of(false);
            }
        });
    }

    private loadMunicipalities(provinceId: string) {
        this.store.dispatch(LocationActions.loadProvince({provinceId}));
    }

    private subscribeToStudentCreation() {
        // Listen for successful student creation
        combineLatest([
            this.store.select(studentsFeature.selectLoadingCreate),
            this.store.select(studentsFeature.selectCreateError),
            this.store.select(selectCreatedStudentId)
        ]).pipe(
            debounceTime(500),
            takeUntil(this.destroy$)
        ).subscribe(([loading, error, createdStudentId]) => {
            // If loading finished and form is disabled
            if (!loading && this.studentForm.disabled) {
                if (!error && createdStudentId) {
                    // Success - student created
                    this.isStudentCreated = true;
                    this.createdStudentId = createdStudentId;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Aluno criado com sucesso! Agora preencha os dados do contrato.'
                    });

                    // Move to contract step
                    this.activeIndex = this.LAST_STEP_INDEX;

                    // Re-enable form for contract step
                    this.studentForm.enable();

                    // Disable all previous step fields to prevent editing
                    this.disablePreviousStepFields();

                } else if (error) {
                    // Error occurred during creation
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

    private disablePreviousStepFields() {
        // Disable all fields except those needed for contract
        const fieldsToDisable = [
            'firstname', 'lastname', 'gender', 'identificationNumber',
            'birthdate', 'email', 'password', 'photo', 'phone',
            'province', 'municipality', 'academicBackground', 'centerId',
            'emergencyContactName', 'emergencyContactRelationship',
            'emergencyContactNumber', 'notes'
        ];

        fieldsToDisable.forEach(field => {
            this.studentForm.get(field)?.disable();
        });
    }

    private setupNavigationGuard() {
        // Warn user if they try to leave after student creation but before contract
        window.addEventListener('beforeunload', (e) => {
            if (this.isStudentCreated && this.activeIndex === 2) {
                e.preventDefault();
                e.returnValue = 'Você criou um aluno mas não finalizou o contrato. Tem certeza que deseja sair?';
            }
        });
    }

    nextStep() {
        // Don't allow next if student is already created and we're before contract step
        if (this.isStudentCreated && this.activeIndex < 2) {
            this.activeIndex = this.LAST_STEP_INDEX;
            return;
        }

        if (this.validateCurrentStep()) {
            this.activeIndex = this.clampStepIndex(this.activeIndex + 1);
        }
    }

    prevStep() {
        // Don't allow going back if student is already created
        if (this.isStudentCreated) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Aluno já foi criado. Complete o contrato para finalizar.'
            });
            return;
        }
        this.activeIndex = this.clampStepIndex(this.activeIndex - 1);
    }

    validateCurrentStep(): boolean {
        const stepFieldsMap = {
            0: ['firstname', 'lastname', 'gender', 'birthdate', 'email', 'phone', 'province', 'municipality', 'academicBackground', 'centerId'],
            1: ['emergencyContactName', 'emergencyContactNumber']
        };

        const currentStepFields = stepFieldsMap[this.activeIndex as keyof typeof stepFieldsMap];
        if (!currentStepFields) return true;

        for (const field of currentStepFields) {
            const control = this.studentForm.get(field);
            if (control && control.invalid) {
                control.markAsTouched();
                return false;
            }
        }

        return true;
    }

    hasFieldError(fieldName: string): boolean {
        const field = this.studentForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

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
        const targetIndex = this.clampStepIndex(index);

        // Don't allow navigation if student is created
        if (this.isStudentCreated && targetIndex < this.LAST_STEP_INDEX) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Aluno já foi criado. Complete o contrato para finalizar.'
            });
            return;
        }

        if (targetIndex < this.activeIndex || this.validateStepsBeforeIndex(targetIndex)) {
            this.activeIndex = targetIndex;
        }
    }

    validateStepsBeforeIndex(targetIndex: number): boolean {
        const stepFieldsMap = {
            0: ['firstname', 'lastname', 'gender', 'birthdate', 'email', 'phone', 'province', 'municipality', 'academicBackground', 'centerId'],
            1: ['emergencyContactName', 'emergencyContactNumber']
        };

        const boundedTarget = this.clampStepIndex(targetIndex);
        for (let step = 0; step < boundedTarget; step++) {
            const fields = stepFieldsMap[step as keyof typeof stepFieldsMap];
            if (!fields) {
                continue;
            }

            for (const field of fields) {
                const control = this.studentForm.get(field);
                if (control && control.invalid) {
                    control.markAsTouched();
                    return false;
                }
            }
        }
        return true;
    }

    saveStudent() {
        this.studentForm.markAllAsTouched();
        console.log('Student Form:', this.studentForm.value);

        if (this.studentForm.valid && this.validateStepsBeforeIndex(this.LAST_STEP_INDEX)) {
            const formValue = this.studentForm.value;
            const createStudentRequest: CreateStudentRequest = {
                identificationNumber: formValue.identificationNumber,
                firstname: formValue.firstname,
                lastname: formValue.lastname,
                gender: formValue.gender,
                birthdate: this.formatDate(formValue.birthdate),
                email: formValue.email,
                password: formValue.password || 'DefaultPassword123',
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

            // Disable form after getting the values
            this.studentForm.disable();

            this.store.dispatch(StudentsActions.createStudentWithRequest({request: createStudentRequest}));
        } else {
            const firstInvalidStep = this.findFirstInvalidStep();
            if (firstInvalidStep !== -1) {
                this.activeIndex = firstInvalidStep;
            }
        }
    }

    onContractCompleted() {
        // Called when contract is successfully created
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Aluno e contrato criados com sucesso!'
        });

        // Reset flags
        this.isStudentCreated = false;
        this.createdStudentId = null;

        // Navigate away
        this.router.navigate(['/schoolar/students']).then();
    }

    private findFirstInvalidStep(): number {
        const stepFieldsMap = {
            0: ['firstname', 'lastname', 'gender', 'birthdate', 'identificationNumber', 'email', 'phone', 'province', 'municipality', 'academicBackground', 'centerId'],
            1: ['emergencyContactName', 'emergencyContactNumber']
        };

        for (let step = 0; step < 2; step++) {
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

    private formatDate(date: Date | null): string {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    }

    onFileSelected(event: any) {
        const file = event.files?.[0];
        console.log(file)
    }

    private clampStepIndex(index: number): number {
        return Math.max(0, Math.min(index, this.LAST_STEP_INDEX));
    }
}
