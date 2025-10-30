import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
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
import { StudentService } from 'src/app/core/services/student.service';
import { LessonService } from 'src/app/core/services/lesson.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { LevelService } from 'src/app/core/services/level.service';
import { CenterService } from 'src/app/core/services/center.service';
import { ContractService } from 'src/app/core/services/contract.service';
import { MaterialCreateRequest, MaterialRelation } from 'src/app/core/models/academic/material';
import { MaterialType } from 'src/app/core/enums/material-type';
import { MaterialContentType } from 'src/app/core/enums/material-content-type';
import { RelatedEntityType } from 'src/app/core/enums/related-entity-type';
import { Student } from 'src/app/core/models/academic/student';
import { Lesson } from 'src/app/core/models/academic/lesson';
import { Unit } from 'src/app/core/models/course/unit';
import { Center } from 'src/app/core/models/corporate/center';
import { Employee } from 'src/app/core/models/corporate/employee';
import { Contract } from 'src/app/core/models/corporate/contract';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { MaterialActions } from 'src/app/core/store/schoolar/materials/material.actions';
import { materialFeature } from 'src/app/core/store/schoolar/materials/material.feature';
import { ofType } from '@ngrx/effects';
import { forkJoin } from 'rxjs';
import {EmployeeService} from "../../../../../../core/services/corporate/employee.service";

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
export class MaterialsCreateComponent implements OnInit {
    loading = false;

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
        private route: ActivatedRoute, // Add ActivatedRoute
        private studentService: StudentService,
        private lessonService: LessonService,
        private unitService: UnitService,
        private assessmentService: AssessmentService,
        private levelService: LevelService,
        private centerService: CenterService,
        private employeeService: EmployeeService,
        private contractService: ContractService,
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
        this.store.select(materialFeature.selectLoadingCreate).subscribe(loading => this.loading = loading);

        // Get query params
        this.route.queryParams.subscribe(params => {
            this.queryParamEntity = params['entity'] || null;
            this.queryParamEntityId = params['entityId'] || null;
        });

        // Load all entity data
        this.loadAllEntityData();
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
        // Create an array of observables for all entity loads
        const loads = [
            this.studentService.getStudents(),
            this.lessonService.getLessons(),
            this.assessmentService.getAssessments(),
            this.levelService.getLevels(),
            this.centerService.getAllCenters(),
            this.employeeService.getEmployees(),
            this.contractService.getContracts()
        ];

        // Set all loading states to true
        this.loadingEntities[RelatedEntityType.STUDENT] = true;
        this.loadingEntities[RelatedEntityType.LESSON] = true;
        this.loadingEntities[RelatedEntityType.ASSESSMENT] = true;
        this.loadingEntities[RelatedEntityType.LEVEL] = true;
        this.loadingEntities[RelatedEntityType.CENTER] = true;
        this.loadingEntities[RelatedEntityType.EMPLOYEE] = true;
        this.loadingEntities[RelatedEntityType.CONTRACT] = true;

        // Use forkJoin to wait for all data to load
        forkJoin(loads).subscribe({
            next: ([students, lessons, assessments, levels, centers, employees, contracts]) => {
                // Process students
                this.relatedEntities[RelatedEntityType.STUDENT] = (students as Student[]).map(student => ({
                    label: `${student.user?.firstname || ''} ${student.user?.lastname || ''} (ID: ${student.id})`,
                    value: student.id || ''
                }));
                this.loadingEntities[RelatedEntityType.STUDENT] = false;

                // Process lessons
                this.relatedEntities[RelatedEntityType.LESSON] = (lessons as Lesson[]).map(lesson => ({
                    label: `${lesson.title} (ID: ${lesson.id})`,
                    value: lesson.id || ''
                }));
                this.loadingEntities[RelatedEntityType.LESSON] = false;

                // Process assessments
                this.relatedEntities[RelatedEntityType.ASSESSMENT] = (assessments as any[]).map(assessment => ({
                    label: `${assessment.title || 'Assessment'} (ID: ${assessment.id})`,
                    value: assessment.id || ''
                }));
                this.loadingEntities[RelatedEntityType.ASSESSMENT] = false;

                // Process levels
                this.levelOptions = (levels as any[]).map(level => ({
                    label: `${level.name || 'Level'} (ID: ${level.id})`,
                    value: level.id || ''
                }));
                this.relatedEntities[RelatedEntityType.LEVEL] = [...this.levelOptions];
                this.loadingEntities[RelatedEntityType.LEVEL] = false;

                // Process centers
                this.relatedEntities[RelatedEntityType.CENTER] = (centers as Center[]).map(center => ({
                    label: `${center.name} (ID: ${center.id})`,
                    value: center.id || ''
                }));
                this.loadingEntities[RelatedEntityType.CENTER] = false;

                // Process employees
                this.relatedEntities[RelatedEntityType.EMPLOYEE] = (employees as Employee[]).map(employee => ({
                    label: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''} (ID: ${employee.id})`,
                    value: employee.id || ''
                }));
                this.loadingEntities[RelatedEntityType.EMPLOYEE] = false;

                // Process contracts
                this.relatedEntities[RelatedEntityType.CONTRACT] = (contracts as Contract[]).map(contract => ({
                    label: `Contract ${contract.id} (ID: ${contract.id})`,
                    value: contract.id || ''
                }));
                this.loadingEntities[RelatedEntityType.CONTRACT] = false;

                // After all data is loaded, process query params
                this.processQueryParams();
            },
            error: (error) => {
                console.error('Error loading entity data:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar dados das entidades'
                });
                // Reset all loading states
                Object.keys(this.loadingEntities).forEach(key => {
                    this.loadingEntities[key] = false;
                });
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

    loadStudents(): void {
        this.loadingEntities[RelatedEntityType.STUDENT] = true;
        this.studentService.getStudents().subscribe({
            next: (students: Student[]) => {
                this.relatedEntities[RelatedEntityType.STUDENT] = students.map(student => ({
                    label: `${student.user?.firstname || ''} ${student.user?.lastname || ''} (ID: ${student.id})`,
                    value: student.id || ''
                }));
                this.loadingEntities[RelatedEntityType.STUDENT] = false;
            },
            error: (error) => {
                console.error('Error loading students:', error);
                this.loadingEntities[RelatedEntityType.STUDENT] = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'Erro ao carregar estudantes'
                });
            }
        });
    }

    loadLessons(): void {
        this.loadingEntities[RelatedEntityType.LESSON] = true;
        this.lessonService.getLessons().subscribe({
            next: (lessons: Lesson[]) => {
                this.relatedEntities[RelatedEntityType.LESSON] = lessons.map(lesson => ({
                    label: `${lesson.title} (ID: ${lesson.id})`,
                    value: lesson.id || ''
                }));
                this.loadingEntities[RelatedEntityType.LESSON] = false;
            },
            error: (error) => {
                console.error('Error loading lessons:', error);
                this.loadingEntities[RelatedEntityType.LESSON] = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'Erro ao carregar aulas'
                });
            }
        });
    }

    loadUnits(): void {
        // Units will be loaded when a level is selected
        this.loadingEntities[RelatedEntityType.UNIT] = false;
    }

    loadUnitsByLevel(levelId: string): void {
        if (!levelId) {
            this.relatedEntities[RelatedEntityType.UNIT] = [];
            return;
        }

        // Check if units for this level are already cached
        if (this.unitsByLevel[levelId]) {
            this.relatedEntities[RelatedEntityType.UNIT] = this.unitsByLevel[levelId].map(unit => ({
                label: `${unit.name} (ID: ${unit.id})`,
                value: unit.id || ''
            }));
            return;
        }

        this.loadingEntities[RelatedEntityType.UNIT] = true;
        this.unitService.loadUnits().subscribe({
            next: (units: Unit[]) => {
                // Filter units by level
                const levelUnits = units.filter(unit => unit.levelId === levelId);
                this.unitsByLevel[levelId] = levelUnits;

                this.relatedEntities[RelatedEntityType.UNIT] = levelUnits.map(unit => ({
                    label: `${unit.name} (ID: ${unit.id})`,
                    value: unit.id || ''
                }));
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

    loadAssessments(): void {
        this.loadingEntities[RelatedEntityType.ASSESSMENT] = true;
        this.assessmentService.getAssessments().subscribe({
            next: (assessments: any[]) => {
                this.relatedEntities[RelatedEntityType.ASSESSMENT] = assessments.map(assessment => ({
                    label: `${assessment.title || 'Assessment'} (ID: ${assessment.id})`,
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

    loadLevels(): void {
        this.loadingEntities[RelatedEntityType.LEVEL] = true;
        this.levelService.getLevels().subscribe({
            next: (levels: any[]) => {
                // Populate both level options and related entities
                this.levelOptions = levels.map(level => ({
                    label: `${level.name || 'Level'} (ID: ${level.id})`,
                    value: level.id || ''
                }));

                this.relatedEntities[RelatedEntityType.LEVEL] = levels.map(level => ({
                    label: `${level.name || 'Level'} (ID: ${level.id})`,
                    value: level.id || ''
                }));
                this.loadingEntities[RelatedEntityType.LEVEL] = false;
            },
            error: (error) => {
                console.error('Error loading levels:', error);
                this.loadingEntities[RelatedEntityType.LEVEL] = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'Erro ao carregar níveis'
                });
            }
        });
    }

    loadCenters(): void {
        this.loadingEntities[RelatedEntityType.CENTER] = true;
        this.centerService.getAllCenters().subscribe({
            next: (centers: Center[]) => {
                this.relatedEntities[RelatedEntityType.CENTER] = centers.map(center => ({
                    label: `${center.name} (ID: ${center.id})`,
                    value: center.id || ''
                }));
                this.loadingEntities[RelatedEntityType.CENTER] = false;
            },
            error: (error) => {
                console.error('Error loading centers:', error);
                this.loadingEntities[RelatedEntityType.CENTER] = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'Erro ao carregar centros'
                });
            }
        });
    }

    loadEmployees(): void {
        this.loadingEntities[RelatedEntityType.EMPLOYEE] = true;
        this.employeeService.getEmployees().subscribe({
            next: (employees: Employee[]) => {
                this.relatedEntities[RelatedEntityType.EMPLOYEE] = employees.map(employee => ({
                    label: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''} (ID: ${employee.id})`,
                    value: employee.id || ''
                }));
                this.loadingEntities[RelatedEntityType.EMPLOYEE] = false;
            },
            error: (error) => {
                console.error('Error loading employees:', error);
                this.loadingEntities[RelatedEntityType.EMPLOYEE] = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'Erro ao carregar funcionários'
                });
            }
        });
    }

    loadContracts(): void {
        this.loadingEntities[RelatedEntityType.CONTRACT] = true;
        this.contractService.getContracts().subscribe({
            next: (contracts: Contract[]) => {
                this.relatedEntities[RelatedEntityType.CONTRACT] = contracts.map(contract => ({
                    label: `Contract ${contract.id} (ID: ${contract.id})`,
                    value: contract.id || ''
                }));
                this.loadingEntities[RelatedEntityType.CONTRACT] = false;
            },
            error: (error) => {
                console.error('Error loading contracts:', error);
                this.loadingEntities[RelatedEntityType.CONTRACT] = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'Erro ao carregar contratos'
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
        this.actions$.pipe(ofType(MaterialActions.createMaterialWithRelationsSuccess)).subscribe(({ material }) => {
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
        this.actions$.pipe(ofType(MaterialActions.createMaterialWithRelationsFailure)).subscribe(({ error }) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro ao Criar Material',
                detail: error || 'Erro desconhecido ao criar material'
            });
        });
    }

    cancel(): void {
        this.router.navigate(['/schoolar/materials']);
    }

    protected readonly RelatedEntityType = RelatedEntityType;
}
