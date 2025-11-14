import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { YoutubePlayerComponent } from '../youtube-player/youtube-player.component';

@Component({
    selector: 'app-video-modal',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        TooltipModule,
        YoutubePlayerComponent
    ],
    template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      [styleClass]="'video-modal-dialog'"
      [contentStyle]="{ padding: '0' }"
      (onHide)="onClose()"
    >
      <ng-template pTemplate="header">
        <div class="flex align-items-center justify-content-between w-full video-modal-header">
          <h3 class="text-lg font-bold m-0 video-modal-title">{{ videoTitle || 'Reproduzir Vídeo' }}</h3>
          <p-button
            icon="pi pi-times"
            [text]="true"
            [rounded]="true"
            severity="secondary"
            (onClick)="onClose()"
            pTooltip="Fechar"
            class="video-modal-close-btn"
          ></p-button>
        </div>
      </ng-template>

      <div class="video-modal-content w-full">
        <app-youtube-player
          *ngIf="videoUrl && videoKey"
          [videoUrl]="videoUrl"
          [autoplay]="autoplay"
          [startTime]="startTime"
          [endTime]="endTime"
          width="100%"
          height="400"
          [attr.data-video-key]="videoKey"
        ></app-youtube-player>

        <div class="video-info p-3" *ngIf="videoDescription">
          <p class="text-gray-600 m-0">{{ videoDescription }}</p>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2 video-modal-footer">
          <p-button
            label="Abrir no YouTube"
            icon="pi pi-external-link"
            [outlined]="true"
            severity="secondary"
            (onClick)="openInYouTube()"
            class="video-modal-footer-btn"
          ></p-button>
          <p-button
            label="Fechar"
            icon="pi pi-times"
            (onClick)="onClose()"
            class="video-modal-footer-btn"
          ></p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
    styles: [`
    .video-modal-content {
      background: #000;
      border-radius: 0 0 8px 8px;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    .video-info {
      background: var(--surface-card);
      border-top: 1px solid var(--surface-border);
    }

    ::ng-deep .video-modal-dialog {
      width: 95vw !important;
      max-width: 1200px !important;
    }

    ::ng-deep .video-modal-dialog .p-dialog-content {
      padding: 0 !important;
      margin: 0 !important;
    }

    ::ng-deep .video-modal-dialog .p-dialog-header {
      border-bottom: 1px solid var(--surface-border);
      padding: 1rem;
    }

    ::ng-deep .video-modal-dialog .p-dialog-content .video-modal-content {
      width: 100% !important;
      max-width: 100% !important;
    }

    ::ng-deep .video-modal-dialog .p-dialog-content app-youtube-player {
      display: block;
      width: 100% !important;
      max-width: 100% !important;
    }

    ::ng-deep .video-modal-dialog .p-dialog-content .youtube-player-container {
      width: 100% !important;
      max-width: 100% !important;
    }

    ::ng-deep .video-modal-dialog .p-dialog-content .video-wrapper {
      width: 100% !important;
      max-width: 100% !important;
    }

    .video-modal-header {
      gap: 0.5rem;
    }

    .video-modal-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }

    .video-modal-close-btn {
      flex-shrink: 0;
    }

    .video-modal-footer {
      flex-wrap: wrap;
      padding: 0.75rem 1rem;
    }

    .video-modal-footer-btn {
      flex: 1 1 auto;
      min-width: 120px;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      ::ng-deep .video-modal-dialog {
        width: 100vw !important;
        max-width: 100vw !important;
        margin: 0 !important;
      }

      ::ng-deep .video-modal-dialog .p-dialog {
        border-radius: 0;
        height: 100vh;
        max-height: 100vh;
        margin: 0 !important;
      }

      ::ng-deep .video-modal-dialog .p-dialog-content {
        max-height: calc(100vh - 140px);
        overflow-y: auto;
        padding: 0 !important;
        margin: 0 !important;
      }

      .video-modal-content {
        border-radius: 0;
      }

      ::ng-deep .video-modal-dialog .p-dialog-content .video-wrapper {
        border-radius: 0 !important;
      }

      .video-modal-header {
        padding: 0.75rem;
      }

      .video-modal-title {
        font-size: 1rem;
        padding-right: 0.5rem;
      }

      .video-modal-footer {
        flex-direction: column;
        gap: 0.5rem;
      }

      .video-modal-footer-btn {
        width: 100%;
        min-width: unset;
      }
    }

    /* Tablet styles */
    @media (min-width: 769px) and (max-width: 1024px) {
      ::ng-deep .video-modal-dialog {
        width: 90vw !important;
        max-width: 900px !important;
      }
    }

    /* Small mobile styles */
    @media (max-width: 480px) {
      .video-modal-header {
        padding: 0.5rem;
      }

      .video-modal-title {
        font-size: 0.9rem;
      }

      ::ng-deep .video-modal-dialog .p-dialog-header {
        padding: 0.75rem;
      }

      .video-modal-footer {
        padding: 0.5rem;
      }
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
