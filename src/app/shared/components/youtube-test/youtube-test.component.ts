import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-youtube-test',
  standalone: true,
  imports: [CommonModule, FormsModule, YouTubePlayerModule],
  template: `
    <div class="p-4">
      <h3>YouTube Player Test</h3>
      <p>Testing YouTube player with a known working video ID</p>

      <div class="mb-3">
        <label>Video ID:</label>
        <input
          type="text"
          [(ngModel)]="testVideoId"
          class="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter YouTube video ID"
        />
        <button
          (click)="loadVideo()"
          class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Load Video
        </button>
      </div>

      <div *ngIf="videoId" class="video-container">
        <h4>Video Player:</h4>
        <youtube-player
          #youtubePlayer
          [videoId]="videoId"
          [width]="640"
          [height]="360"
          [playerVars]="playerVars"
          (ready)="onPlayerReady($event)"
          (stateChange)="onPlayerStateChange($event)"
        ></youtube-player>
      </div>

      <div class="mt-4">
        <h4>Debug Info:</h4>
        <pre>{{ debugInfo | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .video-container {
      margin: 1rem 0;
    }
    pre {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      font-size: 12px;
    }
  `]
})
export class YoutubeTestComponent implements OnInit {
  testVideoId: string = 'dQw4w9WgXcQ'; // Rick Roll as test video
  videoId: string = '';
  playerVars: any = {
    controls: 1,
    showinfo: 1,
    rel: 0,
    modestbranding: 1,
    autoplay: 0,
    enablejsapi: 1
  };

  debugInfo: any = {
    youtubeApiLoaded: false,
    playerReady: false,
    lastState: null,
    errors: []
  };

  ngOnInit(): void {
    this.checkYouTubeAPI();
  }

  loadVideo(): void {
    this.videoId = this.testVideoId;
    this.debugInfo.videoId = this.videoId;
    console.log('Loading video with ID:', this.videoId);
  }

  private checkYouTubeAPI(): void {
    if (typeof (window as any).YT !== 'undefined') {
      this.debugInfo.youtubeApiLoaded = true;
      console.log('YouTube API is loaded');
    } else {
      this.debugInfo.youtubeApiLoaded = false;
      console.warn('YouTube API not loaded');

      // Try to load it
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onload = () => {
        this.debugInfo.youtubeApiLoaded = true;
        console.log('YouTube API loaded successfully');
      };
      script.onerror = () => {
        this.debugInfo.errors.push('Failed to load YouTube API');
        console.error('Failed to load YouTube API');
      };
      document.body.appendChild(script);
    }
  }

  onPlayerReady(event: any): void {
    this.debugInfo.playerReady = true;
    this.debugInfo.playerEvent = event;
    console.log('YouTube player is ready', event);
  }

  onPlayerStateChange(event: any): void {
    this.debugInfo.lastState = event.data;
    this.debugInfo.lastStateChange = event;
    console.log('YouTube player state changed', event);
  }
}
