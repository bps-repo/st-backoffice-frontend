/**
 * Utility functions for handling YouTube URLs and video operations
 */

export interface YouTubeVideoInfo {
  videoId: string;
  isValid: boolean;
  thumbnailUrl: string;
  embedUrl: string;
  watchUrl: string;
}

/**
 * Extracts YouTube video ID from various URL formats
 * @param url YouTube URL in any supported format
 * @returns Video ID if found, empty string otherwise
 */
export function extractYouTubeVideoId(url: string): string {
  if (!url) return '';

  // Handle various YouTube URL formats
  const patterns = [
    // Standard watch URLs
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    // Short URLs
    /youtu\.be\/([^&\n?#]+)/,
    // Embed URLs
    /youtube\.com\/embed\/([^&\n?#]+)/,
    // V URLs
    /youtube\.com\/v\/([^&\n?#]+)/,
    // Mobile URLs
    /m\.youtube\.com\/watch\?v=([^&\n?#]+)/,
    // Shorts URLs
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return '';
}

/**
 * Validates if a URL is a valid YouTube URL
 * @param url URL to validate
 * @returns true if valid YouTube URL, false otherwise
 */
export function isValidYouTubeUrl(url: string): boolean {
  const videoId = extractYouTubeVideoId(url);
  return videoId !== '';
}

/**
 * Gets comprehensive YouTube video information
 * @param url YouTube URL
 * @returns YouTubeVideoInfo object with video details
 */
export function getYouTubeVideoInfo(url: string): YouTubeVideoInfo {
  const videoId = extractYouTubeVideoId(url);

  return {
    videoId,
    isValid: videoId !== '',
    thumbnailUrl: videoId ? getYouTubeThumbnailUrl(videoId) : '',
    embedUrl: videoId ? getYouTubeEmbedUrl(videoId) : '',
    watchUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''
  };
}

/**
 * Gets YouTube thumbnail URL for a video ID
 * @param videoId YouTube video ID
 * @param size Thumbnail size
 * @returns Thumbnail URL
 */
export function getYouTubeThumbnailUrl(
  videoId: string,
  size: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'medium'
): string {
  if (!videoId) return '';

  const sizeMap = {
    'default': 'default',
    'medium': 'mqdefault',
    'high': 'hqdefault',
    'standard': 'sddefault',
    'maxres': 'maxresdefault'
  };

  return `https://img.youtube.com/vi/${videoId}/${sizeMap[size]}.jpg`;
}

/**
 * Gets YouTube embed URL for a video ID
 * @param videoId YouTube video ID
 * @param options Embed options
 * @returns Embed URL
 */
export function getYouTubeEmbedUrl(
  videoId: string,
  options: {
    autoplay?: boolean;
    startTime?: number;
    endTime?: number;
    loop?: boolean;
    controls?: boolean;
    showInfo?: boolean;
    rel?: boolean;
  } = {}
): string {
  if (!videoId) return '';

  let embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const params: string[] = [];

  if (options.autoplay) {
    params.push('autoplay=1');
  }

  if (options.startTime && options.startTime > 0) {
    params.push(`start=${options.startTime}`);
  }

  if (options.endTime && options.endTime > 0) {
    params.push(`end=${options.endTime}`);
  }

  if (options.loop) {
    params.push('loop=1');
    params.push(`playlist=${videoId}`);
  }

  if (options.controls === false) {
    params.push('controls=0');
  }

  if (options.showInfo === false) {
    params.push('showinfo=0');
  }

  if (options.rel === false) {
    params.push('rel=0');
  }

  if (params.length > 0) {
    embedUrl += '?' + params.join('&');
  }

  return embedUrl;
}

/**
 * Extracts time parameters from YouTube URL
 * @param url YouTube URL
 * @returns Object with start and end times in seconds
 */
export function extractTimeFromYouTubeUrl(url: string): { startTime: number; endTime?: number } {
  if (!url) return { startTime: 0 };

  const startMatch = url.match(/[?&]t=(\d+)/);
  const endMatch = url.match(/[?&]end=(\d+)/);

  const startTime = startMatch ? parseInt(startMatch[1], 10) : 0;
  const endTime = endMatch ? parseInt(endMatch[1], 10) : undefined;

  return { startTime, endTime };
}

/**
 * Converts YouTube time format to seconds
 * @param timeString Time in format like "1m30s" or "90s" or "1:30"
 * @returns Time in seconds
 */
export function parseYouTubeTime(timeString: string): number {
  if (!timeString) return 0;

  // Handle formats like "1m30s", "90s", "1:30"
  const timeRegex = /(?:(\d+)m)?(?:(\d+)s)?|(?:(\d+):(\d+))?/;
  const match = timeString.match(timeRegex);

  if (!match) return 0;

  if (match[3] && match[4]) {
    // Format: "1:30"
    return parseInt(match[3], 10) * 60 + parseInt(match[4], 10);
  } else {
    // Format: "1m30s" or "90s"
    const minutes = match[1] ? parseInt(match[1], 10) : 0;
    const seconds = match[2] ? parseInt(match[2], 10) : 0;
    return minutes * 60 + seconds;
  }
}
