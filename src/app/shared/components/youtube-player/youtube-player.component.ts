import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
    selector: 'app-youtube-player',
    standalone: true,
    imports: [CommonModule, YouTubePlayerModule],
    template: `
    <div class="youtube-player-container" [class.fullscreen]="fullscreen">
      <div *ngIf="videoId; else noVideo" class="video-wrapper">
        <youtube-player
          #youtubePlayer
          [videoId]="videoId"
          [width]="width"
          [height]="height"
          [startSeconds]="startTime"
          [endSeconds]="endTime"
          [playerVars]="playerVars"
          (ready)="onPlayerReady($event)"
          (stateChange)="onPlayerStateChange($event)"
          class="youtube-iframe"
        ></youtube-player>
      </div>

      <ng-template #noVideo>
        <div class="no-video-placeholder">
          <i class="pi pi-video text-4xl text-gray-400 mb-3"></i>
          <p class="text-gray-600">URL de vídeo inválida</p>
        </div>
      </ng-template>
    </div>
  `,
    styles: [`
    .youtube-player-container {
      position: relative;
      width: 100%;
      max-width: 100%;
    }

    .video-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .youtube-iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }

    .no-video-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background-color: var(--surface-100);
      border-radius: 8px;
      border: 2px dashed var(--surface-300);
    }

    .fullscreen .video-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      padding-bottom: 0;
      z-index: 9999;
      background: black;
    }

    .fullscreen .youtube-iframe {
      border-radius: 0;
    }
  `]
})
export class YoutubePlayerComponent implements OnInit, OnChanges {
    @Input() videoUrl: string = '';
    @Input() width: string = '100%';
    @Input() height: string = '315';
    @Input() autoplay: boolean = false;
    @Input() fullscreen: boolean = false;
    @Input() startTime: number = 0;
    @Input() endTime?: number;

    @ViewChild('youtubePlayer') youtubePlayer: any;

    videoId: string = '';
    playerVars: any = {
        controls: 1,
        showinfo: 1,
        rel: 0,
        modestbranding: 1,
        autoplay: 0
    };

    constructor() { }

    ngOnInit(): void {
        this.checkYouTubeAPI();
        this.processVideoUrl();
    }

    private checkYouTubeAPI(): void {
        if (typeof (window as any).YT === 'undefined') {
            console.warn('YouTube API not loaded. Loading now...');
            this.loadYouTubeAPI();
        } else {
            console.log('YouTube API is loaded');
        }
    }

    private loadYouTubeAPI(): void {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.onload = () => {
            console.log('YouTube API loaded successfully');
        };
        script.onerror = () => {
            console.error('Failed to load YouTube API');
        };
        document.body.appendChild(script);
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('YouTube Player changes detected:', changes);

        if (changes['videoUrl'] || changes['autoplay'] || changes['startTime'] || changes['endTime']) {
            console.log('Processing video URL changes...');
            this.processVideoUrl();

            // Force re-render if video URL changed
            if (changes['videoUrl']) {
                console.log('Video URL changed, forcing re-render');
                // The component will re-render automatically due to videoId change
            }
        }
    }

    private processVideoUrl(): void {
        if (!this.videoUrl) {
            this.videoId = '';
            return;
        }

        this.videoId = this.extractVideoId(this.videoUrl);

        // Update playerVars based on autoplay setting
        this.playerVars = {
            controls: 1,
            showinfo: 1,
            rel: 0,
            modestbranding: 1,
            autoplay: this.autoplay ? 1 : 0,
            enablejsapi: 1,
            origin: window.location.origin
        };
    } 

    private extractVideoId(url: string): string {
        console.log('Extracting video ID from URL:', url);
        if (!url) return '';

        const cleanUrl = url.trim();

        // Handle various YouTube URL formats
        const patterns = [
            // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
            // Short URL: https://youtu.be/VIDEO_ID
            /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
            // Embed URL: https://www.youtube.com/embed/VIDEO_ID
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
            // Old format: https://www.youtube.com/v/VIDEO_ID
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/,
            // Mobile URL: https://m.youtube.com/watch?v=VIDEO_ID
            /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?v=([^&\n?#]+)/
        ];

        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            const match = cleanUrl.match(pattern);

            if (match && match[1]) {
                const videoId = match[1];
                console.log(`Video ID found with pattern ${i + 1}:`, videoId);

                // YouTube video IDs are typically 11 characters long
                if (videoId.length === 11) {
                    return videoId;
                } else {
                    console.warn(`Unusual video ID length (${videoId.length}):`, videoId);
                    return videoId; // Return anyway, might still be valid
                }
            }
        }

        console.log('No video ID found', cleanUrl);

        return '';
    }

    // YouTube Player event handlers
    onPlayerReady(event: any): void {
        console.log('YouTube player is ready', event);
        console.log('Video ID:', this.videoId);
        console.log('Player Vars:', this.playerVars);

        // If autoplay is enabled, try to play the video
        if (this.autoplay && this.youtubePlayer) {
            try {
                this.youtubePlayer.playVideo();
            } catch (error) {
                console.warn('Could not autoplay video:', error);
            }
        }
    }

    onPlayerStateChange(event: any): void {
        console.log('YouTube player state changed', event);
        console.log('State:', event.data);
    }

    // Method to programmatically play/pause the video
    playVideo(): void {
        if (this.youtubePlayer) {
            try {
                this.youtubePlayer.playVideo();
            } catch (error) {
                console.error('Error playing video:', error);
            }
        } else {
            console.warn('YouTube player not ready');
        }
    }

    // Method to get video thumbnail
    getThumbnailUrl(size: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'medium'): string {
        if (!this.videoId) return '';

        const sizeMap = {
            'default': 'default',
            'medium': 'mqdefault',
            'high': 'hqdefault',
            'standard': 'sddefault',
            'maxres': 'maxresdefault'
        };

        return `https://img.youtube.com/vi/${this.videoId}/${sizeMap[size]}.jpg`;
    }

    // Method to get video info URL
    getVideoInfoUrl(): string {
        if (!this.videoId) return '';
        return `https://www.youtube.com/watch?v=${this.videoId}`;
    }
}
