import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: any;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  totalDuration: number;
  slowestOperation: PerformanceMetric | null;
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private performanceSubject = new BehaviorSubject<PerformanceReport | null>(null);
  public performance$ = this.performanceSubject.asObservable();

  /**
   * Starts timing an operation
   */
  startTimer(name: string, metadata?: any): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata
    });
  }

  /**
   * Ends timing an operation
   */
  endTimer(name: string): number {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric '${name}' not found`);
      return 0;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // Log slow operations
    if (metric.duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${metric.duration.toFixed(2)}ms`);
    }

    return metric.duration;
  }

  /**
   * Gets a specific metric
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Gets all metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Generates a performance report
   */
  generateReport(): PerformanceReport {
    const metrics = this.getAllMetrics();
    const totalDuration = metrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    const slowestOperation = metrics.reduce((slowest, current) =>
      (current.duration || 0) > (slowest?.duration || 0) ? current : slowest, null as PerformanceMetric | null
    );

    const recommendations = this.generateRecommendations(metrics);

    const report: PerformanceReport = {
      metrics,
      totalDuration,
      slowestOperation,
      recommendations
    };

    this.performanceSubject.next(report);
    return report;
  }

  /**
   * Generates performance recommendations
   */
  private generateRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = [];

    // Check for slow API calls
    const slowApiCalls = metrics.filter(m =>
      m.name.includes('API') && (m.duration || 0) > 500
    );
    if (slowApiCalls.length > 0) {
      recommendations.push(`Consider implementing caching for slow API calls (${slowApiCalls.length} operations > 500ms)`);
    }

    // Check for multiple sequential operations
    const sequentialOperations = metrics.filter(m =>
      m.name.includes('sequential') || m.name.includes('sequential')
    );
    if (sequentialOperations.length > 0) {
      recommendations.push('Consider parallelizing sequential operations');
    }

    // Check for large data processing
    const dataProcessing = metrics.filter(m =>
      m.name.includes('process') && (m.duration || 0) > 100
    );
    if (dataProcessing.length > 0) {
      recommendations.push('Consider implementing virtual scrolling for large datasets');
    }

    // Check for heavy DOM operations
    const domOperations = metrics.filter(m =>
      m.name.includes('DOM') && (m.duration || 0) > 50
    );
    if (domOperations.length > 0) {
      recommendations.push('Consider using OnPush change detection strategy');
    }

    return recommendations;
  }

  /**
   * Clears all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.performanceSubject.next(null);
  }

  /**
   * Monitors a function execution
   */
  monitorFunction<T>(name: string, fn: () => T, metadata?: any): T {
    this.startTimer(name, metadata);
    try {
      const result = fn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  /**
   * Monitors an async function execution
   */
  async monitorAsyncFunction<T>(name: string, fn: () => Promise<T>, metadata?: any): Promise<T> {
    this.startTimer(name, metadata);
    try {
      const result = await fn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  /**
   * Monitors an observable
   */
  monitorObservable<T>(name: string, observable: Observable<T>, metadata?: any): Observable<T> {
    this.startTimer(name, metadata);
    return new Observable(observer => {
      observable.subscribe({
        next: (value) => {
          this.endTimer(name);
          observer.next(value);
        },
        error: (error) => {
          this.endTimer(name);
          observer.error(error);
        },
        complete: () => {
          this.endTimer(name);
          observer.complete();
        }
      });
    });
  }

  /**
   * Logs performance data to console
   */
  logPerformance(): void {
    const report = this.generateReport();
    console.group('Performance Report');
    console.table(report.metrics.map(m => ({
      name: m.name,
      duration: `${m.duration?.toFixed(2)}ms`,
      metadata: m.metadata
    })));
    console.log('Total Duration:', `${report.totalDuration.toFixed(2)}ms`);
    console.log('Slowest Operation:', report.slowestOperation?.name, `${report.slowestOperation?.duration?.toFixed(2)}ms`);
    if (report.recommendations.length > 0) {
      console.log('Recommendations:', report.recommendations);
    }
    console.groupEnd();
  }
}
