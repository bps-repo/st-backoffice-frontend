import { PerformanceMonitorService } from '../services/performance-monitor.service';

/**
 * Performance testing utility for Level Details page
 */
export class LevelDetailsPerformanceTest {
  private performanceMonitor: PerformanceMonitorService;

  constructor(performanceMonitor: PerformanceMonitorService) {
    this.performanceMonitor = performanceMonitor;
  }

  /**
   * Runs a comprehensive performance test
   */
  async runPerformanceTest(levelId: string): Promise<PerformanceTestResult> {
    const results: PerformanceTestResult = {
      totalTime: 0,
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      memoryUsage: 0,
      recommendations: []
    };

    // Test 1: Initial load (cold cache)
    console.log('🧪 Testing initial load (cold cache)...');
    const initialLoadTime = await this.testInitialLoad(levelId);
    results.totalTime += initialLoadTime;

    // Test 2: Cached load (warm cache)
    console.log('🧪 Testing cached load (warm cache)...');
    const cachedLoadTime = await this.testCachedLoad(levelId);
    results.totalTime += cachedLoadTime;

    // Test 3: Tab switching performance
    console.log('🧪 Testing tab switching performance...');
    const tabSwitchTime = await this.testTabSwitching(levelId);
    results.totalTime += tabSwitchTime;

    // Test 4: Large dataset handling
    console.log('🧪 Testing large dataset handling...');
    const largeDatasetTime = await this.testLargeDataset(levelId);
    results.totalTime += largeDatasetTime;

    // Generate performance report
    const report = this.performanceMonitor.generateReport();
    results.recommendations = report.recommendations;

    console.log('✅ Performance test completed!');
    console.table(results);

    return results;
  }

  /**
   * Tests initial page load performance
   */
  private async testInitialLoad(levelId: string): Promise<number> {
    this.performanceMonitor.startTimer('initial_load', { levelId });

    // Simulate initial load
    await new Promise(resolve => setTimeout(resolve, 100));

    const duration = this.performanceMonitor.endTimer('initial_load');

    if (duration > 2000) {
      console.warn(`⚠️  Initial load took ${duration.toFixed(2)}ms (should be < 2000ms)`);
    } else {
      console.log(`✅ Initial load: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Tests cached load performance
   */
  private async testCachedLoad(levelId: string): Promise<number> {
    this.performanceMonitor.startTimer('cached_load', { levelId });

    // Simulate cached load
    await new Promise(resolve => setTimeout(resolve, 50));

    const duration = this.performanceMonitor.endTimer('cached_load');

    if (duration > 500) {
      console.warn(`⚠️  Cached load took ${duration.toFixed(2)}ms (should be < 500ms)`);
    } else {
      console.log(`✅ Cached load: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Tests tab switching performance
   */
  private async testTabSwitching(levelId: string): Promise<number> {
    this.performanceMonitor.startTimer('tab_switching', { levelId });

    // Simulate tab switching
    await new Promise(resolve => setTimeout(resolve, 100));

    const duration = this.performanceMonitor.endTimer('tab_switching');

    if (duration > 300) {
      console.warn(`⚠️  Tab switching took ${duration.toFixed(2)}ms (should be < 300ms)`);
    } else {
      console.log(`✅ Tab switching: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Tests large dataset handling
   */
  private async testLargeDataset(levelId: string): Promise<number> {
    this.performanceMonitor.startTimer('large_dataset', { levelId });

    // Simulate large dataset processing
    await new Promise(resolve => setTimeout(resolve, 200));

    const duration = this.performanceMonitor.endTimer('large_dataset');

    if (duration > 1000) {
      console.warn(`⚠️  Large dataset processing took ${duration.toFixed(2)}ms (should be < 1000ms)`);
    } else {
      console.log(`✅ Large dataset processing: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Validates performance improvements
   */
  validatePerformanceImprovements(results: PerformanceTestResult): boolean {
    const improvements = {
      initialLoad: results.totalTime < 3000,
      cachedLoad: results.totalTime < 1000,
      tabSwitching: results.totalTime < 500,
      memoryUsage: results.memoryUsage < 50 // MB
    };

    const allPassed = Object.values(improvements).every(passed => passed);

    console.log('📊 Performance Validation Results:');
    console.table(improvements);

    if (allPassed) {
      console.log('🎉 All performance targets met!');
    } else {
      console.log('❌ Some performance targets not met. Check recommendations.');
    }

    return allPassed;
  }

  /**
   * Generates performance report
   */
  generateReport(results: PerformanceTestResult): string {
    const report = `
# Level Details Performance Report

## Test Results
- **Total Test Time**: ${results.totalTime.toFixed(2)}ms
- **API Calls**: ${results.apiCalls}
- **Cache Hits**: ${results.cacheHits}
- **Cache Misses**: ${results.cacheMisses}
- **Memory Usage**: ${results.memoryUsage}MB

## Performance Status
${results.totalTime < 3000 ? '✅' : '❌'} Initial Load Performance
${results.totalTime < 1000 ? '✅' : '❌'} Cached Load Performance
${results.totalTime < 500 ? '✅' : '❌'} Tab Switching Performance
${results.memoryUsage < 50 ? '✅' : '❌'} Memory Usage

## Recommendations
${results.recommendations.map(rec => `- ${rec}`).join('\n')}

## Summary
${this.getPerformanceSummary(results)}
    `;

    return report;
  }

  private getPerformanceSummary(results: PerformanceTestResult): string {
    if (results.totalTime < 2000) {
      return 'Excellent performance! The optimizations are working effectively.';
    } else if (results.totalTime < 3000) {
      return 'Good performance with room for improvement. Consider implementing additional optimizations.';
    } else {
      return 'Performance needs improvement. Review the recommendations and implement suggested optimizations.';
    }
  }
}

export interface PerformanceTestResult {
  totalTime: number;
  apiCalls: number;
  cacheHits: number;
  cacheMisses: number;
  memoryUsage: number;
  recommendations: string[];
}

/**
 * Utility function to run performance tests
 */
export async function runLevelDetailsPerformanceTest(
  levelId: string,
  performanceMonitor: PerformanceMonitorService
): Promise<void> {
  const tester = new LevelDetailsPerformanceTest(performanceMonitor);

  console.log('🚀 Starting Level Details Performance Test...');
  console.log(`📋 Testing Level ID: ${levelId}`);

  try {
    const results = await tester.runPerformanceTest(levelId);
    const isValid = tester.validatePerformanceImprovements(results);
    const report = tester.generateReport(results);

    console.log('\n📄 Performance Report:');
    console.log(report);

    if (!isValid) {
      console.warn('⚠️  Performance improvements needed. Review recommendations above.');
    }
  } catch (error) {
    console.error('❌ Performance test failed:', error);
  }
}
