import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {MessageService, SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {
    LEVELS,
} from 'src/app/shared/constants/app';

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
    ],
    providers: [MessageService],
    templateUrl: './materials-create.component.html'
})
export class MaterialsCreateComponent implements OnInit {

    // Material data
    material = {
        title: '',
        description: '',
        type: '',
        fileUrl: ''
    };

    // File upload
    selectedFile: File | null = null;

    // Access control
    accessControl = {
        hasTimeLimit: false,
        startDate: null,
        endDate: null
    };

    // Distribution
    distribution: {
        selectedLevels: string[];
        selectedClasses: string[];
        selectedTurmas: string[];
        selectedStudents: string[];
    } = {
        selectedLevels: [],
        selectedClasses: [],
        selectedTurmas: [],
        selectedStudents: []
    };

    // Dropdown options
    materialTypes: SelectItem[] = [
        { label: 'PDF', value: 'pdf' },
        { label: 'DOC', value: 'doc' },
        { label: 'Video', value: 'video' },
        { label: 'Áudio', value: 'audio' },
        { label: 'Imagem', value: 'image' }
    ];

    levels: SelectItem[] = [
        { label: 'Básico', value: '1' },
        { label: 'Intermediário', value: '2' },
        { label: 'Avançado', value: '3' }
    ];

    classes: SelectItem[] = [
        { label: 'Aula 1', value: 'aula-1' },
        { label: 'Aula 2', value: 'aula-2' },
        { label: 'Aula 3', value: 'aula-3' },
        { label: 'Aula 4', value: 'aula-4' }
    ];

    turmas: SelectItem[] = [
        { label: 'Turma A', value: 'turma-a' },
        { label: 'Turma B', value: 'turma-b' },
        { label: 'Turma C', value: 'turma-c' }
    ];

    specificStudents: SelectItem[] = [
        { label: 'Ana Silva', value: 'ana-silva' },
        { label: 'João Santos', value: 'joao-santos' },
        { label: 'Maria Costa', value: 'maria-costa' },
        { label: 'Pedro Oliveira', value: 'pedro-oliveira' }
    ];

    constructor(
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        // Auto-select level from navigation state (when coming from a specific level)
        const nav = history.state as any;
        if (nav?.levelId) {
            const exists = this.levels.some(l => l.value === nav.levelId);
            if (exists) {
                this.distribution.selectedLevels = [nav.levelId];
            }
        }
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.selectedFile = event.files[0];

            // Auto-detect file type
            const fileName = this.selectedFile!.name.toLowerCase();
            if (fileName.includes('.pdf')) {
                this.material.type = 'pdf';
            } else if (fileName.includes('.doc') || fileName.includes('.docx')) {
                this.material.type = 'doc';
            } else if (fileName.includes('.mp4') || fileName.includes('.avi')) {
                this.material.type = 'video';
            }

            // In real app, upload file and get URL
            this.material.fileUrl = `uploads/${this.selectedFile!.name}`;

            this.messageService.add({
                severity: 'success',
                summary: 'Arquivo Selecionado',
                detail: `${this.selectedFile!.name} foi selecionado`
            });
        }
    }

    onFileUpload(event: any): void {
        // Handle file upload
        this.messageService.add({
            severity: 'success',
            summary: 'Upload Concluído',
            detail: 'Material enviado com sucesso'
        });
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

    isFormValid(): boolean {
        if (!this.material.title || !this.material.type) return false;
        if (this.material.type === 'video') {
            return !!this.material.fileUrl; // expecting a URL for videos
        }
        return !!this.selectedFile; // non-video requires a file
    }

    saveMaterial(): void {
        if (!this.isFormValid()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Formulário Inválido',
                detail: 'Por favor, preencha todos os campos obrigatórios'
            });
            return;
        }

        // Create material object
        const materialData = {
            ...this.material,
            accessControl: this.accessControl,
            distribution: this.distribution
        };

        // In real app, save to service/API
        console.log('Saving material:', materialData);

        this.messageService.add({
            severity: 'success',
            summary: 'Material Salvo',
            detail: 'Material didático foi salvo com sucesso'
        });

        // Navigate back to list
        setTimeout(() => {
            this.router.navigate(['/schoolar/materials']);
        }, 2000);
    }

    cancel(): void {
        this.router.navigate(['/schoolar/materials']);
    }
}
