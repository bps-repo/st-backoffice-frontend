import {CommonModule} from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router'; // Add ActivatedRoute
import {MessageService, SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DatePickerModule} from 'primeng/datepicker';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {MultiSelectModule} from 'primeng/multiselect';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {ChipModule} from 'primeng/chip';
import {TooltipModule} from 'primeng/tooltip';
import {AssessmentService} from 'src/app/core/services/assessment.service';
import {CenterService} from 'src/app/core/services/center.service';
import {ContractService} from 'src/app/core/services/contract.service';
import {LevelService} from 'src/app/core/services/level.service';
import {MaterialsFacade} from 'src/app/core/services/materials/material.facade';
import {LessonService} from 'src/app/core/services/lessons/lesson.service';
import {StudentService} from 'src/app/core/services/student.service';
import {UnitService} from 'src/app/core/services/unit.service';
import {EmployeeService} from 'src/app/core/services/corporate/employee.service';
import {MaterialCreateRequest, MaterialRelation, MaterialUploadRequest} from 'src/app/core/models/academic/material';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {Student} from 'src/app/core/models/academic/students/student';
import {MaterialType} from 'src/app/core/enums/material-type';
import {MaterialContentType} from 'src/app/core/enums/material-content-type';
import {RelatedEntityType} from 'src/app/core/enums/related-entity-type';
import {Contract} from 'src/app/core/models/corporate/contract';
import {Center} from 'src/app/core/models/corporate/center';
import {Unit} from 'src/app/core/models/course/unit';
import {Employee} from 'src/app/core/models/corporate/employee';
import {of, Subject, takeUntil} from 'rxjs';
import type {Observable} from 'rxjs';
import {catchError, finalize, map, take} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {authFeature} from 'src/app/core/store/auth/auth.reducers';
import {ShowToastErrorService} from 'src/app/shared/services/show-toast-error-service';

@Component({
    styleUrl: './materials-create.component.scss',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        DropdownModule,
        FileUploadModule,
        CheckboxModule,
        DatePickerModule,
        InputSwitchModule,
        ToastModule,
        MultiSelectModule,
        CardModule,
        DividerModule,
        ChipModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './materials-create.component.html'
})
export class MaterialsCreateComponent implements OnInit, OnDestroy {
    private messageService = inject(MessageService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private assessmentService = inject(AssessmentService);
    private studentService = inject(StudentService);
    private lessonService = inject(LessonService);
    private levelService = inject(LevelService);
    private centerService = inject(CenterService);
    private employeeService = inject(EmployeeService);
    private contractService = inject(ContractService);
    private unitService = inject(UnitService);
    private materialsFacade = inject(MaterialsFacade);
    private store = inject(Store);
    private cdr = inject(ChangeDetectorRef);

    loading = this.materialsFacade.loading;
    private destroy$ = new Subject<void>();

    /** All units from API — used when picking units by level without NgRx selectors. */
    private allUnits: Unit[] = [];
    private readonly loadedEntityTypes = new Set<RelatedEntityType>();
    private unitsLoaded = false;

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
    relatedEntityOptions: SelectItem[] = [];

    ngOnInit() {
        this.store.select(authFeature.selectUser).pipe(take(1), takeUntil(this.destroy$)).subscribe(user => {
            if (user?.id) {
                this.material.uploaderId = user.id;
            }
        });

        // Set default dates
        const today = new Date();
        const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        this.material.availabilityStartDate = today.toISOString().split('T')[0];
        this.material.availabilityEndDate = nextYear.toISOString().split('T')[0];

        // Get query params
        this.route.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.queryParamEntity = params['entity'] || null;
                this.queryParamEntityId = params['entityId'] || null;

                if (this.queryParamEntity && Object.values(RelatedEntityType).includes(this.queryParamEntity as RelatedEntityType)) {
                    this.preloadQueryParamEntity(this.queryParamEntity as RelatedEntityType);
                }
            });
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

    private preloadQueryParamEntity(entityType: RelatedEntityType): void {
        if (entityType === RelatedEntityType.UNIT) {
            this.loadEntityOptions(RelatedEntityType.LEVEL);
            return;
        }

        this.loadEntityOptions(entityType, () => this.processQueryParams());
    }

    private loadEntityOptions(
        entityType: RelatedEntityType,
        onComplete?: () => void,
    ): void {
        if (this.loadedEntityTypes.has(entityType)) {
            this.refreshRelatedEntityOptions();
            onComplete?.();
            return;
        }

        this.loadingEntities[entityType] = true;
        this.relatedEntityOptions = [];
        this.cdr.detectChanges();

        this.fetchEntityOptions(entityType)
            .pipe(
                takeUntil(this.destroy$),
                catchError(() => {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Aviso',
                        detail: `Erro ao carregar ${this.getEntityType(entityType).toLowerCase()}s`,
                    });
                    return of([] as SelectItem[]);
                }),
                finalize(() => {
                    this.loadingEntities[entityType] = false;
                    this.refreshRelatedEntityOptions();
                    this.cdr.detectChanges();
                }),
            )
            .subscribe((options) => {
                this.relatedEntities[entityType] = options;
                this.loadedEntityTypes.add(entityType);

                if (entityType === RelatedEntityType.LEVEL) {
                    this.levelOptions = [...options];
                }

                this.refreshRelatedEntityOptions();
                onComplete?.();
                this.cdr.detectChanges();
            });
    }

    private fetchEntityOptions(entityType: RelatedEntityType): Observable<SelectItem[]> {
        switch (entityType) {
            case RelatedEntityType.STUDENT:
                return this.studentService.getStudents().pipe(
                    map((students) => this.mapStudentsToOptions(students)),
                );
            case RelatedEntityType.LESSON:
                return this.lessonService.searchLessons({ size: 1000 }).pipe(
                    map((response) => this.mapLessonsToOptions(response.content ?? [])),
                );
            case RelatedEntityType.LEVEL:
                return this.levelService.getLevels().pipe(
                    map((levels) => this.mapLevelsToOptions(levels)),
                );
            case RelatedEntityType.CENTER:
                return this.centerService.getAllCenters().pipe(
                    map((centers) => this.mapCentersToOptions(centers)),
                );
            case RelatedEntityType.EMPLOYEE:
                return this.employeeService.getEmployees().pipe(
                    map((employees) => this.mapEmployeesToOptions(employees)),
                );
            case RelatedEntityType.CONTRACT:
                return this.contractService.getContracts({ size: 1000 }).pipe(
                    map((page) => this.mapContractsToOptions(page.content ?? [])),
                );
            case RelatedEntityType.ASSESSMENT:
                return this.assessmentService.getAssessments().pipe(
                    map((assessments) => this.mapAssessmentsToOptions(assessments)),
                );
            default:
                return of([]);
        }
    }

    private loadUnitsData(onComplete?: () => void): void {
        if (this.unitsLoaded) {
            onComplete?.();
            return;
        }

        this.loadingEntities[RelatedEntityType.UNIT] = true;
        this.cdr.detectChanges();

        this.unitService.loadUnits()
            .pipe(
                takeUntil(this.destroy$),
                catchError(() => {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Aviso',
                        detail: 'Erro ao carregar unidades',
                    });
                    return of([] as Unit[]);
                }),
                finalize(() => {
                    this.loadingEntities[RelatedEntityType.UNIT] = false;
                    this.cdr.detectChanges();
                }),
            )
            .subscribe((units) => {
                this.allUnits = units;
                this.unitsLoaded = true;
                this.buildUnitsByLevelIndex();
                onComplete?.();
                this.cdr.detectChanges();
            });
    }

    private buildUnitsByLevelIndex(): void {
        this.unitsByLevel = {};
        this.allUnits.forEach((unit) => {
            if (!unit.levelId) {
                return;
            }
            if (!this.unitsByLevel[unit.levelId]) {
                this.unitsByLevel[unit.levelId] = [];
            }
            if (!this.unitsByLevel[unit.levelId].some((u) => u.id === unit.id)) {
                this.unitsByLevel[unit.levelId].push(unit);
            }
        });
    }

    private mapStudentsToOptions(students: Student[]): SelectItem[] {
        return students.map((student) => ({
            label: `${student.user?.firstname || ''} ${student.user?.lastname || ''}`.trim() || 'Estudante',
            value: student.id || '',
        }));
    }

    private mapLessonsToOptions(lessons: Lesson[]): SelectItem[] {
        return lessons.map((lesson) => ({
            label: lesson.title,
            value: lesson.id || '',
        }));
    }

    private mapLevelsToOptions(levels: unknown[]): SelectItem[] {
        return levels.map((level) => ({
            label: `${(level as { name?: string }).name || 'Nível'}`,
            value: (level as { id: string }).id || '',
        }));
    }

    private mapCentersToOptions(centers: Center[]): SelectItem[] {
        return centers.map((center) => ({
            label: center.name,
            value: center.id || '',
        }));
    }

    private mapEmployeesToOptions(employees: Employee[]): SelectItem[] {
        return employees.map((employee) => ({
            label: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`.trim() || 'Funcionário',
            value: employee.id || '',
        }));
    }

    private mapContractsToOptions(contracts: Contract[]): SelectItem[] {
        return contracts.map((contract) => ({
            label: `Contracto ${contract.code}`,
            value: contract.id || '',
        }));
    }

    private mapAssessmentsToOptions(assessments: unknown[]): SelectItem[] {
        return assessments.map((assessment) => ({
            label: `${(assessment as { title?: string }).title || 'Avaliação'}`,
            value: (assessment as { id?: string }).id || '',
        }));
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
                relationsSection.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }, 500);
    }

    loadUnitsByLevel(levelId: string): void {
        if (!levelId) {
            this.relatedEntities[RelatedEntityType.UNIT] = [];
            this.relatedEntityOptions = [];
            return;
        }

        let units = this.unitsByLevel[levelId];
        if (!units?.length) {
            units = this.allUnits.filter(u => u.levelId === levelId);
            if (units.length > 0) {
                this.unitsByLevel[levelId] = units;
            }
        }

        const options = (units ?? []).map(unit => ({
            label: `${unit.name}`,
            value: unit.id || ''
        }));
        this.relatedEntities[RelatedEntityType.UNIT] = options;
        this.relatedEntityOptions = [...options];
    }

    /** p-dropdown sometimes binds the whole option object unless optionValue resolves — keeps store keys aligned. */
    private normalizeRelationEntityType(raw: unknown): string {
        if (raw === null || raw === undefined || raw === '') {
            return '';
        }
        if (typeof raw === 'string') {
            return raw;
        }
        if (typeof raw === 'object' && raw !== null && 'value' in raw) {
            const v = (raw as SelectItem).value;
            return v === null || v === undefined ? '' : String(v);
        }
        return String(raw);
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.selectedFile = event.files[0];

            // Auto-detect file type from extension when not yet chosen
            if (!this.material.fileType) {
                const fileName = this.selectedFile!.name.toLowerCase();
                if (fileName.endsWith('.pdf')) {
                    this.material.fileType = MaterialType.PDF;
                } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
                    this.material.fileType = MaterialType.DOCX;
                } else if (fileName.endsWith('.mp3') || fileName.endsWith('.wav')) {
                    this.material.fileType = MaterialType.AUDIO;
                } else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
                    this.material.fileType = MaterialType.PRESENTATION;
                } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
                    this.material.fileType = MaterialType.EXCEL;
                }
            }

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
        this.material.relations.push({...this.newRelation});

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

    private refreshRelatedEntityOptions(): void {
        const key = this.normalizeRelationEntityType(this.newRelation.relatedEntityType);
        if (!key) {
            this.relatedEntityOptions = [];
            return;
        }

        if (key === RelatedEntityType.UNIT) {
            if (!this.selectedLevelId) {
                this.relatedEntityOptions = [];
                return;
            }
            this.loadUnitsByLevel(this.selectedLevelId);
            return;
        }

        this.relatedEntityOptions = [...(this.relatedEntities[key] ?? [])];
    }

    isEntityLoading(entityType: string | RelatedEntityType | unknown): boolean {
        const key = this.normalizeRelationEntityType(entityType);
        if (!key) {
            return false;
        }
        return this.loadingEntities[key] ?? false;
    }

    getEntityCount(entityType: string | RelatedEntityType | unknown): number {
        const key = this.normalizeRelationEntityType(entityType);
        return key ? this.relatedEntities[key]?.length || 0 : 0;
    }

    onEntityTypeChange(entityType: string | SelectItem | unknown): void {
        const normalized = this.normalizeRelationEntityType(entityType);
        this.newRelation.relatedEntityType = normalized;
        if (normalized) {
            this.selectedType.set(normalized as RelatedEntityType);
        }
        this.newRelation.relatedEntityId = '';
        this.selectedLevelId = '';
        this.relatedEntityOptions = [];

        if (!normalized) {
            this.cdr.detectChanges();
            return;
        }

        if (normalized === RelatedEntityType.UNIT) {
            this.relatedEntities[RelatedEntityType.UNIT] = [];
            this.loadEntityOptions(RelatedEntityType.LEVEL);
            return;
        }

        this.loadEntityOptions(normalized as RelatedEntityType);
    }

    onLevelChange(levelId: string): void {
        this.selectedLevelId = levelId;
        this.newRelation.relatedEntityId = '';

        if (this.newRelation.relatedEntityType !== RelatedEntityType.UNIT || !levelId) {
            this.cdr.detectChanges();
            return;
        }

        this.loadUnitsData(() => {
            this.loadUnitsByLevel(this.selectedLevelId);
            this.cdr.detectChanges();
        });
    }

    isUnitEntityType(): boolean {
        return this.newRelation.relatedEntityType === RelatedEntityType.UNIT;
    }

    shouldShowLevelSelection(): boolean {
        return this.isUnitEntityType();
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
            this.material.uploaderId &&
            this.material.availabilityStartDate &&
            this.material.availabilityEndDate &&
            this.material.relations.length > 0
        );

        if (!basicFieldsValid) {
            return false;
        }

        // Video type → must have a non-placeholder URL
        if (this.material.fileType === MaterialType.VIDEO) {
            return !!this.material.fileUrl && this.material.fileUrl !== 'https://youtu.be/...';
        }

        // All other types → must have a local file ready to upload
        return !!this.selectedFile;
    }

    isVideoFileType(): boolean {
        return this.material.fileType === MaterialType.VIDEO;
    }

    async saveMaterial(): Promise<void> {
        if (!this.isFormValid()) {
            const message = this.isVideoFileType()
                ? 'Por favor, preencha todos os campos obrigatórios, adicione pelo menos uma relação e informe uma URL válida para o vídeo'
                : 'Por favor, preencha todos os campos obrigatórios, adicione pelo menos uma relação e faça upload de um arquivo';

            this.messageService.add({
                severity: 'error',
                summary: 'Formulário Inválido',
                detail: message
            });
            return;
        }

        if (this.isVideoFileType()) {
            // Video: send as plain JSON — fileUrl already holds the external link
            await this.materialsFacade.createMaterialWithRelations(this.material);
        } else {
            // File: send as multipart/form-data → POST /materials/upload-with-relations
            const uploadRequest: MaterialUploadRequest = {
                title: this.material.title,
                description: this.material.description,
                fileType: this.material.fileType,
                type: this.material.type,
                uploaderId: this.material.uploaderId,
                active: this.material.active,
                availabilityStartDate: this.material.availabilityStartDate,
                availabilityEndDate: this.material.availabilityEndDate,
                relations: this.material.relations
            };
            await this.materialsFacade.uploadMaterialWithRelations(this.selectedFile!, uploadRequest);
        }

        if (this.materialsFacade.error()) {
            ShowToastErrorService.showToastError(
                'Erro ao Criar Material',
                this.materialsFacade.error(),
                this.messageService,
                'Erro desconhecido ao criar material'
            );
            return;
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Material Criado',
            detail: 'Material foi criado com sucesso!'
        });
        setTimeout(() => {
            this.router.navigate(['/schoolar/materials']);
        }, 1000);
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
