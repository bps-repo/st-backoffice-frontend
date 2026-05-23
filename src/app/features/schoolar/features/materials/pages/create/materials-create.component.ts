import {CommonModule} from '@angular/common';
import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router'; // Add ActivatedRoute
import {MessageService, SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
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
import {AssessmentService} from 'src/app/core/services/assessment.service';
import {CenterService} from 'src/app/core/services/center.service';
import {ContractService} from 'src/app/core/services/contract.service';
import {LevelService} from 'src/app/core/services/level.service';
import {MaterialsFacade} from 'src/app/core/services/materials/material.facade';
import {LessonService} from 'src/app/core/services/lessons/lesson.service';
import {StudentService} from 'src/app/core/services/student.service';
import {UnitService} from 'src/app/core/services/unit.service';
import {EmployeeService} from 'src/app/core/services/corporate/employee.service';
import {MaterialCreateRequest, MaterialRelation} from 'src/app/core/models/academic/material';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {Student} from 'src/app/core/models/academic/students/student';
import {MaterialType} from 'src/app/core/enums/material-type';
import {MaterialContentType} from 'src/app/core/enums/material-content-type';
import {RelatedEntityType} from 'src/app/core/enums/related-entity-type';
import {Contract} from 'src/app/core/models/corporate/contract';
import {Center} from 'src/app/core/models/corporate/center';
import {Unit} from 'src/app/core/models/course/unit';
import {Employee} from 'src/app/core/models/corporate/employee';
import {forkJoin, of, Subject, takeUntil} from 'rxjs';
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

    loading = this.materialsFacade.loading;
    private destroy$ = new Subject<void>();

    /** All units from API — used when picking units by level without NgRx selectors. */
    private allUnits: Unit[] = [];

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
            });

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
        const fallback = <T>(source: Observable<T>, empty: T) =>
            source.pipe(catchError(() => of(empty)));

        const clearRelationsLoadingFlags = () => {
            for (const type of Object.values(RelatedEntityType)) {
                this.loadingEntities[type] = false;
            }
        };

        for (const type of Object.values(RelatedEntityType)) {
            this.loadingEntities[type] = true;
        }

        forkJoin({
            students: fallback(this.studentService.getStudents(), [] as Student[]),
            lessons: fallback(this.lessonService.searchLessons({size: 1000}).pipe(map(r => r.content ?? [])), [] as Lesson[]),
            levels: fallback(this.levelService.getLevels(), [] as unknown[]),
            centers: fallback(this.centerService.getAllCenters(), [] as Center[]),
            employees: fallback(this.employeeService.getEmployees(), [] as Employee[]),
            contracts: fallback(this.contractService.getContracts(), [] as Contract[]),
            units: fallback(this.unitService.loadUnits(), [] as Unit[]),
            assessments: fallback(this.assessmentService.getAssessments(), [] as unknown[])
        })
            .pipe(
                takeUntil(this.destroy$),
                // forkJoin may complete without calling next/error if an inner observable completes empty;
                // without this the UI stays stuck showing "Carregando…" forever.
                finalize(() => clearRelationsLoadingFlags())
            )
            .subscribe({
                next: result => {
                    try {
                        this.applyFetchedRelations(result);
                    } catch (e) {
                        console.error('Materials create: erro ao aplicar dados das relações', e);
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Aviso',
                            detail: 'Erro ao processar dados carregados. Tente atualizar a página.'
                        });
                    }
                },
                error: () => {
                    clearRelationsLoadingFlags();
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Aviso',
                        detail: 'Erro ao carregar dados relacionados'
                    });
                }
            });
    }

    private applyFetchedRelations(result: {
        students: Student[];
        lessons: Lesson[];
        levels: unknown[];
        centers: Center[];
        employees: Employee[];
        contracts: Contract[];
        units: Unit[];
        assessments: unknown[];
    }): void {
        const {students, lessons, levels, centers, employees, contracts, units, assessments} = result;

        this.relatedEntities[RelatedEntityType.ASSESSMENT] = (assessments ?? []).map((assessment: any) => ({
            label: `${assessment.title || 'Assessment'}`,
            value: assessment.id || ''
        }));

        this.relatedEntities[RelatedEntityType.STUDENT] = (students ?? []).map(student => ({
            label: `${student.user?.firstname || ''} ${student.user?.lastname || ''}`,
            value: student.id || ''
        }));

        this.relatedEntities[RelatedEntityType.LESSON] = (lessons ?? []).map(lesson => ({
            label: `${lesson.title}`,
            value: lesson.id || ''
        }));

        this.levelOptions = (levels ?? []).map(level => ({
            label: `${(level as {name?: string}).name || 'Nível'}`,
            value: (level as {id: string}).id || ''
        }));
        this.relatedEntities[RelatedEntityType.LEVEL] = [...this.levelOptions];

        this.relatedEntities[RelatedEntityType.CENTER] = (centers ?? []).map(center => ({
            label: `${center.name}`,
            value: center.id || ''
        }));

        this.relatedEntities[RelatedEntityType.EMPLOYEE] = (employees ?? []).map((employee: Employee) => ({
            label: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`,
            value: employee.id || ''
        }));

        this.relatedEntities[RelatedEntityType.CONTRACT] = (contracts ?? []).map((contract: Contract) => ({
            label: `Contracto ${contract.code}`,
            value: contract.id || ''
        }));

        this.allUnits = units ?? [];
        this.unitsByLevel = {};
        this.allUnits.forEach(unit => {
            if (!unit.levelId) {
                return;
            }
            if (!this.unitsByLevel[unit.levelId]) {
                this.unitsByLevel[unit.levelId] = [];
            }
            if (!this.unitsByLevel[unit.levelId].some(u => u.id === unit.id)) {
                this.unitsByLevel[unit.levelId].push(unit);
            }
        });

        this.processQueryParams();
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
            return;
        }

        let units = this.unitsByLevel[levelId];
        if (!units?.length) {
            units = this.allUnits.filter(u => u.levelId === levelId);
            if (units.length > 0) {
                this.unitsByLevel[levelId] = units;
            }
        }

        this.relatedEntities[RelatedEntityType.UNIT] = (units ?? []).map(unit => ({
            label: `${unit.name}`,
            value: unit.id || ''
        }));
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

    getRelatedEntityOptions(): SelectItem[] {
        const key = this.normalizeRelationEntityType(this.newRelation.relatedEntityType);
        return key ? this.relatedEntities[key] ?? [] : [];
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

    onEntityTypeChange(): void {
        const normalized = this.normalizeRelationEntityType(this.newRelation.relatedEntityType as unknown);
        this.newRelation.relatedEntityType = normalized;
        if (normalized) {
            this.selectedType.set(normalized as RelatedEntityType);
        }
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

    async saveMaterial(): Promise<void> {
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

        await this.materialsFacade.createMaterialWithRelations(this.material);

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
