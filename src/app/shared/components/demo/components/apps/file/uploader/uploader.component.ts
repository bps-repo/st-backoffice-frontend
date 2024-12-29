import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

interface Image {
    name: string;
    objectURL: string;
}

@Component({
    selector: 'app-file-uploader',
    templateUrl: './uploader.component.html',
    standalone: true,
    imports: [
        FileUploadModule,
        CommonModule,
        ToastModule,
        ButtonModule,
        FormsModule,
    ],
    providers: [MessageService],
})
export class UploaderComponent {
    uploadedFiles: any[] = [];

    @ViewChildren('buttonEl') buttonEl!: QueryList<ElementRef>;

    constructor(private messageService: MessageService) {}

    onUpload(event: any) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File uploaded successfully',
        });
    }

    onImageMouseOver(file: Image) {
        this.buttonEl.toArray().forEach((el) => {
            el.nativeElement.id === file.name
                ? (el.nativeElement.style.display = 'flex')
                : null;
        });
    }

    onImageMouseLeave(file: Image) {
        this.buttonEl.toArray().forEach((el) => {
            el.nativeElement.id === file.name
                ? (el.nativeElement.style.display = 'none')
                : null;
        });
    }

    removeImage(event: Event, file: any) {
        event.stopPropagation();
        this.uploadedFiles = this.uploadedFiles.filter((i) => i !== file);
    }
}
