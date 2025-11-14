import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Add ActivatedRoute
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { MaterialCreateRequest, MaterialRelation } from 'src/app/core/models/academic/material';
import { MaterialType } from 'src/app/core/enums/material-type';
import { MaterialContentType } from 'src/app/core/enums/material-content-type';
import { RelatedEntityType } from 'src/app/core/enums/related-entity-type';
import { Unit } from 'src/app/core/models/course/unit';
import { Employee } from 'src/app/core/models/corporate/employee';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { MaterialActions } from 'src/app/core/store/schoolar/materials/material.actions';
import { materialFeature } from 'src/app/core/store/schoolar/materials/material.feature';
import { StudentsActions } from 'src/app/core/store/schoolar/students/students.actions';
import { selectAllStudents } from 'src/app/core/store/schoolar/students/students.selectors';
import { lessonsActions } from 'src/app/core/store/schoolar/lessons/lessons.actions';
import { selectAllLessons } from 'src/app/core/store/schoolar/lessons/lessons.selectors';
import { LevelActions } from 'src/app/core/store/schoolar/level/level.actions';
import { selectAllLevels } from 'src/app/core/store/schoolar/level/level.selector';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import { selectAllCenters } from 'src/app/core/store/corporate/center/centers.selector';
import { EmployeesActions } from 'src/app/core/store/corporate/employees/employees.actions';
import { selectAllEmployees } from 'src/app/core/store/corporate/employees/employees.selector';
import { ContractActions } from 'src/app/core/store/corporate/contracts/contracts.actions';
import { selectAllContracts } from 'src/app/core/store/corporate/contracts/contracts.selectors';
import { UnitActions } from 'src/app/core/store/schoolar/units/unit.actions';
import { selectAllUnits, selectUnitsByLevelId } from 'src/app/core/store/schoolar/units/unit.selectors';
import { combineLatest, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        DropdownModule,
        FileUploadModule,
        InputTextareaModule,
        CheckboxModule,
        CalendarModule,
        InputSwitchModule,
        ToastModule,
        MultiSelectModule,
        CardModule,
        DividerModule,
        ChipModule
    ],
    providers: [MessageService],
    templateUrl: './materials-create.component.html'
})
export class MaterialsCreateComponent implements OnInit, OnDestroy {
    loading = false;
    private destroy$ = new Subject<void>();

    // Material data
    material: MaterialCreateRequest = {
        title: '',
        description: '',
        fileType: '',
        type: '',
        fileUrl: '',
        uploaderId: '',
        active: true,
        availabilityStartDate: '',
        availabilityEndDate: '',
        relations: []
    };

    // File upload
    selectedFile: File | null = null;

    selectedType = signal(RelatedEntityType.STUDENT)

    // Relations management
    newRelation: MaterialRelation = {
        relatedEntityType: '',
        relatedEntityId: '',
        description: '',
        orderIndex: 1,
        isRequired: true,
        isActive: true
    };

    // Query params for auto-distribution
    private queryParamEntity: string | null = null;
    private queryParamEntityId: string | null = null;

    // Dropdown options
    fileTypeOptions: SelectItem[] = Object.values(MaterialType).map(type => ({
        label: type,
        value: type
    }));

    contentTypeOptions: SelectItem[] = Object.values(MaterialContentType).map(type => ({
        label: type.replace('_', ' '),
        value: type
    }));

    relatedEntityTypeOptions: SelectItem[] = Object.values(RelatedEntityType).map(type => ({
        label: this.getEntityType(type),
        value: type
    }));

    // Real data for related entities
    relatedEntities: { [key: string]: SelectItem[] } = {
        [RelatedEntityType.STUDENT]: [],
        [RelatedEntityType.LESSON]: [],
        [RelatedEntityType.UNIT]: [],
        [RelatedEntityType.ASSESSMENT]: [],
        [RelatedEntityType.LEVEL]: [],
        [RelatedEntityType.CENTER]: [],
        [RelatedEntityType.EMPLOYEE]: [],
        [RelatedEntityType.CONTRACT]: []
    };

    // Loading states for each entity type
    loadingEntities: { [key: string]: boolean } = {
        [RelatedEntityType.STUDENT]: false,
        [RelatedEntityType.LESSON]: false,
        [RelatedEntityType.UNIT]: false,
        [RelatedEntityType.ASSESSMENT]: false,
        [RelatedEntityType.LEVEL]: false,
        [RelatedEntityType.CENTER]: false,
        [RelatedEntityType.EMPLOYEE]: false,
        [RelatedEntityType.CONTRACT]: false
    };

    // Level selection for units
    selectedLevelId: string = '';
    levelOptions: SelectItem[] = [];
    unitsByLevel: { [levelId: string]: Unit[] } = {};

    constructor(
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private assessmentService: AssessmentService,
        private store: Store,
        private actions$: Actions,
    ) {
    }

    ngOnInit() {
        // Set default uploader ID (in real app, get from auth service)
        this.material.uploaderId = '2c42fc7c-5e3d-43f7-a3d8-cd13e0554cad';

        // Set default dates
        const today = new Date();
        const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        this.material.availabilityStartDate = today.toISOString().split('T')[0];
        this.material.availabilityEndDate = nextYear.toISOString().split('T')[0];

        // Mirror loading state from store
        this.store.select(materialFeature.selectLoadingCreate)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => this.loading = loading);

        // Get query params
        this.route.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.queryParamEntity = params['entity'] || null;
                this.queryParamEntityId = params['entityId'] || null;
            });

        // Dispatch actions to load all entity data
        this.loadAllEntityData();

        // Subscribe to store data
        this.subscribeToStoreData();
    }

    protected getEntityType(type: RelatedEntityType) {
        switch (type) {
            case RelatedEntityType.STUDENT:
                return 'Estudante';
            case RelatedEntityType.LESSON:
                return 'Aula';
            case RelatedEntityType.UNIT:
                return 'Unidade';
            case RelatedEntityType.ASSESSMENT:
                return 'Avaliação'
            case RelatedEntityType.LEVEL:
                return 'Nível'
            case RelatedEntityType.CENTER:
                return 'Centro'
            case RelatedEntityType.EMPLOYEE:
                return "Funcionário"
            case RelatedEntityType.CONTRACT:
                return "Contrato"
            default:
                return 'N/A'
        }
    }

    loadAllEntityData(): void {
        // Dispatch NgRx actions to load all entities
        this.store.dispatch(StudentsActions.loadStudents());
        this.store.dispatch(lessonsActions.loadLessons());
        this.store.dispatch(LevelActions.loadLevels({}));
        this.store.dispatch(CenterActions.loadCenters());
        this.store.dispatch(EmployeesActions.loadEmployees());
        this.store.dispatch(ContractActions.loadContracts());
        this.store.dispatch(UnitActions.loadUnits());

        // Load assessments via service (no NgRx store for all assessments yet)
        this.loadingEntities[RelatedEntityType.ASSESSMENT] = true;
        this.assessmentService.getAssessments()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (assessments: any[]) => {
                    this.relatedEntities[RelatedEntityType.ASSESSMENT] = assessments.map(assessment => ({
                        label: `${assessment.title || 'Assessment'}`,
                        value: assessment.id || ''
                    }));
                    this.loadingEntities[RelatedEntityType.ASSESSMENT] = false;
                },
                error: (error) => {
                    console.error('Error loading assessments:', error);
                    this.loadingEntities[RelatedEntityType.ASSESSMENT] = false;
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Aviso',
                        detail: 'Erro ao carregar avaliações'
                    });
                }
            });
    }

    subscribeToStoreData(): void {
        let queryParamsProcessed = false;

        // Combine all store observables
        combineLatest([
            this.store.select(selectAllStudents),
            this.store.select(selectAllLessons),
            this.store.select(selectAllLevels),
            this.store.select(selectAllCenters),
            this.store.select(selectAllEmployees),
            this.store.select(selectAllContracts),
            this.store.select(selectAllUnits)
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([students, lessons, levels, centers, employees, contracts, units]) => {
                // Process students
                if (students && students.length > 0) {
                    this.relatedEntities[RelatedEntityType.STUDENT] = students.map(student => ({
                        label: `${student.user?.firstname || ''} ${student.user?.lastname || ''}`,
                        value: student.id || ''
                    }));
                    this.loadingEntities[RelatedEntityType.STUDENT] = false;
                }

                // Process lessons
                if (lessons && lessons.length > 0) {
                    this.relatedEntities[RelatedEntityType.LESSON] = lessons.map(lesson => ({
                        label: `${lesson.title}`,
                        value: lesson.id || ''
                    }));
                    this.loadingEntities[RelatedEntityType.LESSON] = false;
                }

                // Process levels
                if (levels && levels.length > 0) {
                    this.levelOptions = levels.map(level => ({
                        label: `${level.name || 'Nível'}`,
                        value: level.id || ''
                    }));
                    this.relatedEntities[RelatedEntityType.LEVEL] = [...this.levelOptions];
                    this.loadingEntities[RelatedEntityType.LEVEL] = false;
                }

                // Process centers
                if (centers && centers.length > 0) {
                    this.relatedEntities[RelatedEntityType.CENTER] = centers.map(center => ({
                        label: `${center.name}`,
                        value: center.id || ''
                    }));
                    this.loadingEntities[RelatedEntityType.CENTER] = false;
                }

                // Process employees
                if (employees && Array.isArray(employees) && employees.length > 0) {
                    this.relatedEntities[RelatedEntityType.EMPLOYEE] = employees.map((employee: Employee) => ({
                        label: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`,
                        value: employee.id || ''
                    }));
                    this.loadingEntities[RelatedEntityType.EMPLOYEE] = false;
                }

                // Process contracts
                if (contracts && contracts.length > 0) {
                    this.relatedEntities[RelatedEntityType.CONTRACT] = contracts.map(contract => ({
                        label: `Contracto ${contract.code}`,
                        value: contract.id || ''
                    }));
                    this.loadingEntities[RelatedEntityType.CONTRACT] = false;
                }

                // Process units - store all units for later filtering by level
                if (units && units.length > 0) {
                    // Group units by levelId
                    units.forEach(unit => {
                        if (unit.levelId) {
                            if (!this.unitsByLevel[unit.levelId]) {
                                this.unitsByLevel[unit.levelId] = [];
                            }
                            // Avoid duplicates
                            if (!this.unitsByLevel[unit.levelId].find(u => u.id === unit.id)) {
                                this.unitsByLevel[unit.levelId].push(unit);
                            }
                        }
                    });
                }

                // Process query params after all data is loaded (only once)
                if (!queryParamsProcessed &&
                    students && Array.isArray(students) && students.length > 0 &&
                    lessons && Array.isArray(lessons) && lessons.length > 0 &&
                    levels && Array.isArray(levels) && levels.length > 0 &&
                    centers && Array.isArray(centers) && centers.length > 0 &&
                    employees && Array.isArray(employees) && employees.length > 0 &&
                    contracts && Array.isArray(contracts) && contracts.length > 0) {
                    queryParamsProcessed = true;
                    this.processQueryParams();
                }
            });
    }

    private processQueryParams(): void {
        if (!this.queryParamEntity || !this.queryParamEntityId) {
            return;
        }

        // Validate that the entity type is valid
        if (!Object.values(RelatedEntityType).includes(this.queryParamEntity as RelatedEntityType)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: `Tipo de entidade inválido: ${this.queryParamEntity}`
            });
            return;
        }

        const entityType = this.queryParamEntity as RelatedEntityType;

        // Check if the entity ID exists in the loaded entities
        const entityExists = this.relatedEntities[entityType]?.some(
            entity => entity.value === this.queryParamEntityId
        );

        if (!entityExists) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: `Entidade com ID ${this.queryParamEntityId} não encontrada`
            });
            return;
        }

        // Get entity name for description
        const entity = this.relatedEntities[entityType].find(
            e => e.value === this.queryParamEntityId
        );

        // Add the relation automatically
        const autoRelation: MaterialRelation = {
            relatedEntityType: entityType,
            relatedEntityId: this.queryParamEntityId,
            description: `Distribuição automática para ${this.getEntityType(entityType)}: ${entity?.label || this.queryParamEntityId}`,
            orderIndex: 1,
            isRequired: true,
            isActive: true
        };

        this.material.relations.push(autoRelation);

        // Show success message
        this.messageService.add({
            severity: 'success',
            summary: 'Distribuição Adicionada',
            detail: `Distribuição automática adicionada para ${this.getEntityType(entityType)}`
        });

        // Optionally, scroll to the relations section
        setTimeout(() => {
            const relationsSection = document.querySelector('p-card[header="Distribuições"]');
            if (relationsSection) {
                relationsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);
    }

    loadUnitsByLevel(levelId: string): void {
        if (!levelId) {
            this.relatedEntities[RelatedEntityType.UNIT] = [];
            return;
        }

        // Check if units for this level are already cached
        if (this.unitsByLevel[levelId]) {
            this.relatedEntities[RelatedEntityType.UNIT] = this.unitsByLevel[levelId].map(unit => ({
                label: `${unit.name}`,
                value: unit.id || ''
            }));
            return;
        }

        // Use store selector to get units by level
        this.store.select(selectUnitsByLevelId(levelId))
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (units: Unit[]) => {
                    if (units && units.length > 0) {
                        this.unitsByLevel[levelId] = units;
                        this.relatedEntities[RelatedEntityType.UNIT] = units.map(unit => ({
                            label: `${unit.name}`,
                            value: unit.id || ''
                        }));
                    }
                    this.loadingEntities[RelatedEntityType.UNIT] = false;
                },
                error: (error) => {
                    console.error('Error loading units for level:', error);
                    this.loadingEntities[RelatedEntityType.UNIT] = false;
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Aviso',
                        detail: 'Erro ao carregar unidades do nível'
                    });
                }
            });
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.selectedFile = event.files[0];

            // Auto-detect file type
            const fileName = this.selectedFile!.name.toLowerCase();
            if (fileName.includes('.pdf')) {
                this.material.fileType = MaterialType.PDF;
            } else if (fileName.includes('.doc') || fileName.includes('.docx')) {
                this.material.fileType = MaterialType.DOCX;
            } else if (fileName.includes('.mp3') || fileName.includes('.wav')) {
                this.material.fileType = MaterialType.AUDIO;
            } else if (fileName.includes('.ppt') || fileName.includes('.pptx')) {
                this.material.fileType = MaterialType.PRESENTATION;
            } else if (fileName.includes('.xls') || fileName.includes('.xlsx')) {
                this.material.fileType = MaterialType.EXCEL;
            }

            // In real app, upload file and get URL
            this.material.fileUrl = `https://example.com/uploads/${this.selectedFile!.name}`;

            this.messageService.add({
                severity: 'success',
                summary: 'Arquivo Selecionado',
                detail: `${this.selectedFile!.name} foi selecionado`
            });
        }
    }

    onFileTypeChange(): void {
        // Clear file selection and URL when file type changes
        this.selectedFile = null;
        this.material.fileUrl = '';

        // If video is selected, set a default URL placeholder
        if (this.material.fileType === MaterialType.VIDEO) {
            this.material.fileUrl = 'https://youtu.be/...';
        }
    }

    onFileUploadError(event: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro no Upload',
            detail: 'Erro ao enviar o arquivo'
        });
    }

    removeFile(event: Event): void {
        event.stopPropagation();
        this.selectedFile = null;
        this.material.fileUrl = '';
        this.messageService.add({
            severity: 'info',
            summary: 'Arquivo Removido',
            detail: 'Arquivo foi removido'
        });
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    addRelation(): void {
        if (!this.newRelation.relatedEntityType || !this.newRelation.relatedEntityId || !this.newRelation.description) {
            this.messageService.add({
                severity: 'error',
                summary: 'Campos Obrigatórios',
                detail: 'Preencha todos os campos da relação'
            });
            return;
        }

        // Set order index
        this.newRelation.orderIndex = this.material.relations.length + 1;

        // Add relation to material
        this.material.relations.push({ ...this.newRelation });

        // Reset form
        this.newRelation = {
            relatedEntityType: '',
            relatedEntityId: '',
            description: '',
            orderIndex: 1,
            isRequired: true,
            isActive: true
        };

        this.messageService.add({
            severity: 'success',
            summary: 'Relação Adicionada',
            detail: 'Relação foi adicionada com sucesso'
        });
    }

    removeRelation(index: number): void {
        this.material.relations.splice(index, 1);
        // Update order indices
        this.material.relations.forEach((relation, idx) => {
            relation.orderIndex = idx + 1;
        });
    }

    getRelatedEntityOptions(): SelectItem[] {
        return this.relatedEntities[this.newRelation.relatedEntityType] || [];
    }

    isEntityLoading(entityType: string): boolean {
        return this.loadingEntities[entityType] || false;
    }

    getEntityCount(entityType: string): number {
        return this.relatedEntities[entityType]?.length || 0;
    }

    onEntityTypeChange(): void {
        this.selectedType.set(this.newRelation.relatedEntityType as RelatedEntityType)
        this.newRelation.relatedEntityId = '';
        this.selectedLevelId = '';

        if (this.newRelation.relatedEntityType === RelatedEntityType.UNIT) {
            this.relatedEntities[RelatedEntityType.UNIT] = [];
        }
    }

    onLevelChange(): void {
        this.newRelation.relatedEntityId = '';

        if (this.newRelation.relatedEntityType === RelatedEntityType.UNIT) {
            this.loadUnitsByLevel(this.selectedLevelId);
        }
    }

    isUnitEntityType(): boolean {
        return this.newRelation.relatedEntityType === RelatedEntityType.UNIT;
    }

    shouldShowLevelSelection(): boolean {
        return this.isUnitEntityType() && this.levelOptions.length > 0;
    }

    getRelatedEntityPlaceholder(): string {
        if (this.isEntityLoading(this.newRelation.relatedEntityType)) {
            return 'Carregando...';
        }

        if (this.isUnitEntityType()) {
            if (!this.selectedLevelId) {
                return 'Selecione um nível primeiro';
            }
            return 'Selecione a unidade';
        }

        return 'Selecione a entidade';
    }

    isRelatedEntityDisabled(): boolean {
        if (!this.newRelation.relatedEntityType || this.isEntityLoading(this.newRelation.relatedEntityType)) {
            return true;
        }

        if (this.isUnitEntityType()) {
            return !this.selectedLevelId;
        }

        return false;
    }

    isAddRelationButtonEnabled(): boolean {
        if (!this.newRelation.relatedEntityType || !this.newRelation.relatedEntityId || !this.newRelation.description) {
            return false;
        }

        if (this.isUnitEntityType()) {
            return !!this.selectedLevelId;
        }

        return true;
    }

    isFormValid(): boolean {
        const basicFieldsValid = !!(
            this.material.title &&
            this.material.description &&
            this.material.fileType &&
            this.material.type &&
            this.material.fileUrl &&
            this.material.uploaderId &&
            this.material.availabilityStartDate &&
            this.material.availabilityEndDate &&
            this.material.relations.length > 0
        );

        if (this.material.fileType === MaterialType.VIDEO) {
            return basicFieldsValid && !!this.material.fileUrl && this.material.fileUrl !== 'https://youtu.be/...';
        }

        return basicFieldsValid && !!this.selectedFile;
    }

    isVideoFileType(): boolean {
        return this.material.fileType === MaterialType.VIDEO;
    }

    saveMaterial(): void {
        if (!this.isFormValid()) {
            const message = this.material.fileType === MaterialType.VIDEO
                ? 'Por favor, preencha todos os campos obrigatórios, adicione pelo menos uma relação e informe uma URL válida para o vídeo'
                : 'Por favor, preencha todos os campos obrigatórios, adicione pelo menos uma relação e faça upload de um arquivo';

            this.messageService.add({
                severity: 'error',
                summary: 'Formulário Inválido',
                detail: message
            });
            return;
        }

        // Dispatch NgRx action to create material with relations
        this.store.dispatch(MaterialActions.createMaterialWithRelations({ request: this.material }));

        // Listen for success
        this.actions$.pipe(
            ofType(MaterialActions.createMaterialWithRelationsSuccess),
            takeUntil(this.destroy$)
        ).subscribe(({ material }) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Material Criado',
                detail: 'Material foi criado com sucesso!'
            });
            setTimeout(() => {
                this.router.navigate(['/schoolar/materials']);
            }, 1000);
        });

        // Listen for failure
        this.actions$.pipe(
            ofType(MaterialActions.createMaterialWithRelationsFailure),
            takeUntil(this.destroy$)
        ).subscribe(({ error }) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro ao Criar Material',
                detail: error || 'Erro desconhecido ao criar material'
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    cancel(): void {
        this.router.navigate(['/schoolar/materials']);
    }

    protected readonly RelatedEntityType = RelatedEntityType;
}
