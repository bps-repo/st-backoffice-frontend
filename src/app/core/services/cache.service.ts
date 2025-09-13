import { Injectable } from '@angular/core';

export interface CacheConfig {
  timeout: number; // Cache timeout in milliseconds
  checkInterval?: number; // How often to check if cache is expired (optional)
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly DEFAULT_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_CHECK_INTERVAL = 30 * 1000; // 30 seconds

  /**
   * Check if cache is expired based on last fetch time and timeout
   */
  isCacheExpired(lastFetch: number | null, timeout: number = this.DEFAULT_TIMEOUT): boolean {
    if (!lastFetch) {
      return true;
    }

    const now = Date.now();
    return (now - lastFetch) > timeout;
  }

  /**
   * Get cache age in milliseconds
   */
  getCacheAge(lastFetch: number | null): number {
    if (!lastFetch) {
      return Infinity;
    }
    return Date.now() - lastFetch;
  }

  /**
   * Check if cache should be refreshed based on various conditions
   */
  shouldRefreshCache(
    lastFetch: number | null,
    cacheExpired: boolean,
    forceRefresh: boolean = false,
    timeout: number = this.DEFAULT_TIMEOUT
  ): boolean {
    return forceRefresh ||
           cacheExpired ||
           this.isCacheExpired(lastFetch, timeout);
  }

  /**
   * Get cache status information
   */
  getCacheStatus(lastFetch: number | null, timeout: number = this.DEFAULT_TIMEOUT) {
    const age = this.getCacheAge(lastFetch);
    const isExpired = this.isCacheExpired(lastFetch, timeout);
    const timeUntilExpiry = timeout - age;

    return {
      age,
      isExpired,
      timeUntilExpiry: Math.max(0, timeUntilExpiry),
      lastFetch: lastFetch ? new Date(lastFetch) : null
    };
  }

  /**
   * Create a cache configuration object
   */
  createCacheConfig(timeout: number = this.DEFAULT_TIMEOUT, checkInterval?: number): CacheConfig {
    return {
      timeout,
      checkInterval: checkInterval || this.DEFAULT_CHECK_INTERVAL
    };
  }
}
