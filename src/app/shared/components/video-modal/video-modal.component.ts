import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { YoutubePlayerComponent } from '../youtube-player/youtube-player.component';

@Component({
    selector: 'app-video-modal',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        YoutubePlayerComponent
    ],
    template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '90vw', maxWidth: '1200px' }"
      [contentStyle]="{ padding: '0' }"
      (onHide)="onClose()"
    >
      <ng-template pTemplate="header">
        <div class="flex align-items-center justify-content-between w-full">
          <h3 class="text-lg font-bold m-0">{{ videoTitle || 'Reproduzir Vídeo' }}</h3>
          <p-button
            icon="pi pi-times"
            [text]="true"
            [rounded]="true"
            severity="secondary"
            (onClick)="onClose()"
            pTooltip="Fechar"
          ></p-button>
        </div>
      </ng-template>

      <div class="video-modal-content">
        <app-youtube-player
          *ngIf="videoUrl && videoKey"
          [videoUrl]="videoUrl"
          [autoplay]="autoplay"
          [startTime]="startTime"
          [endTime]="endTime"
          width="100%"
          height="600"
          [attr.data-video-key]="videoKey"
        ></app-youtube-player>

        <div class="video-info p-3" *ngIf="videoDescription">
          <p class="text-gray-600 m-0">{{ videoDescription }}</p>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2">
          <p-button
            label="Abrir no YouTube"
            icon="pi pi-external-link"
            [outlined]="true"
            severity="secondary"
            (onClick)="openInYouTube()"
          ></p-button>
          <p-button
            label="Fechar"
            icon="pi pi-times"
            (onClick)="onClose()"
          ></p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
    styles: [`
    .video-modal-content {
      background: #000;
      border-radius: 0 0 8px 8px;
    }

    .video-info {
      background: var(--surface-card);
      border-top: 1px solid var(--surface-border);
    }

    ::ng-deep .p-dialog .p-dialog-content {
      padding: 0;
    }

    ::ng-deep .p-dialog .p-dialog-header {
      border-bottom: 1px solid var(--surface-border);
    }
  `]
})
export class VideoModalComponent implements OnInit, OnChanges {
    @Input() visible: boolean = false;
    @Input() videoUrl: string = '';
    @Input() videoTitle: string = '';
    @Input() videoDescription: string = '';
    @Input() autoplay: boolean = true;
    @Input() startTime: number = 0;
  @Input() endTime?: number;

  @Output() onCloseEvent = new EventEmitter<void>();

  // Unique key to force re-render when video changes
  videoKey: string = '';

    constructor() {}

    ngOnInit(): void {
        console.log('Video Modal initialized');
        console.log('Video URL:', this.videoUrl);
        console.log('Video Title:', this.videoTitle);
        console.log('Autoplay:', this.autoplay);
    }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Video Modal changes detected:', changes);

    // Check if video URL changed and modal is visible
    if (changes['videoUrl'] && this.visible) {
      console.log('Video URL changed and modal is visible');
      console.log('New video URL:', this.videoUrl);
      console.log('Video Title:', this.videoTitle);
      console.log('Autoplay:', this.autoplay);

      // Generate new key to force re-render
      this.videoKey = this.videoUrl + '_' + Date.now();
    }

    // Check if modal visibility changed
    if (changes['visible']) {
      console.log('Modal visibility changed:', this.visible);
      if (this.visible) {
        console.log('Modal opened with video data:');
        console.log('Video URL:', this.videoUrl);
        console.log('Video Title:', this.videoTitle);
        console.log('Video Description:', this.videoDescription);
        console.log('Autoplay:', this.autoplay);

        // Generate new key to force re-render
        this.videoKey = this.videoUrl + '_' + Date.now();
      }
    }
  }

    onClose(): void {
        this.visible = false;
        this.onCloseEvent.emit();
    }

    openInYouTube(): void {
        if (this.videoUrl) {
            window.open(this.videoUrl, '_blank');
        }
    }
}
