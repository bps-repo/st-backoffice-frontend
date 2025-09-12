import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin, combineLatest } from 'rxjs';
import { map, catchError, shareReplay, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Level } from '../models/course/level';
import { Unit } from '../models/course/unit';
import { Student } from '../models/academic/student';
import { UnitProgress } from '../models/academic/unit-progress';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';

export interface LevelDetailData {
  level: Level;
  units: Unit[];
  students: Student[];
  unitProgresses: UnitProgress[];
  statistics: {
    totalStudents: number;
    totalUnits: number;
    totalTopics: number;
    totalHours: number;
    averageProgress: number;
    progressStats: {
      completed: number;
      inProgress: number;
      notStarted: number;
    };
  };
}

export interface LevelDetailCache {
  data: LevelDetailData;
  timestamp: number;
  isExpired: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LevelDetailService {
  private apiUrl = environment.apiUrl;
  private cache = new Map<string, LevelDetailCache>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Shared observables for real-time updates
  private levelDetailSubject = new BehaviorSubject<LevelDetailData | null>(null);
  public levelDetail$ = this.levelDetailSubject.asObservable().pipe(
    shareReplay(1),
    distinctUntilChanged()
  );

  constructor(private http: HttpClient) {}

  /**
   * Loads complete level details with all related data in optimized batches
   */
  loadLevelDetails(levelId: string): Observable<LevelDetailData> {
    const cacheKey = `level_detail_${levelId}`;
    const cached = this.getCachedData(cacheKey);

    if (cached && !cached.isExpired) {
      this.levelDetailSubject.next(cached.data);
      return of(cached.data);
    }

    // Load all data in parallel with optimized batching
    return forkJoin({
      level: this.loadLevel(levelId),
      units: this.loadUnitsForLevel(levelId),
      students: this.loadStudentsForLevel(levelId)
    }).pipe(
      map(({ level, units, students }) => {
        // Load unit progresses in parallel for all units
        const unitProgressObservables = units.map(unit =>
          this.loadUnitProgresses(unit.id).pipe(
            catchError(error => {
              console.error(`Error loading unit progresses for unit ${unit.id}:`, error);
              return of([]);
            })
          )
        );

        return combineLatest(unitProgressObservables).pipe(
          map(progressArrays => {
            const unitProgresses = progressArrays.flat();
            const statistics = this.calculateStatistics(units, students, unitProgresses);

            const levelDetailData: LevelDetailData = {
              level,
              units,
              students,
              unitProgresses,
              statistics
            };

            // Cache the data
            this.cacheData(cacheKey, levelDetailData);
            this.levelDetailSubject.next(levelDetailData);

            return levelDetailData;
          })
        );
      }),
      switchMap(data => data),
      catchError(error => {
        console.error('Error loading level details:', error);
        throw error;
      })
    );
  }

  /**
   * Loads only level data
   */
  private loadLevel(levelId: string): Observable<Level> {
    return this.http.get<ApiResponse<Level>>(`${this.apiUrl}/levels/${levelId}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error loading level:', error);
        throw error;
      })
    );
  }

  /**
   * Loads units for a specific level with optimized filtering
   */
  private loadUnitsForLevel(levelId: string): Observable<Unit[]> {
    return this.http.get<ApiResponse<PageableResponse<Unit[]>>>(`${this.apiUrl}/units`).pipe(
      map(response => response.data.content.filter(unit => unit.levelId === levelId)),
      catchError(error => {
        console.error('Error loading units for level:', error);
        return of([]);
      })
    );
  }

  /**
   * Loads students for a specific level with optimized filtering
   */
  private loadStudentsForLevel(levelId: string): Observable<Student[]> {
    return this.http.get<ApiResponse<Student[]>>(`${this.apiUrl}/students`).pipe(
      map(response => {
        const data = response.data;
        const list = Array.isArray(data) ? data : (data?.content ?? []);
        return list.filter((student: any) => student.levelId === levelId);
      }),
      catchError(error => {
        console.error('Error loading students for level:', error);
        return of([]);
      })
    );
  }

  /**
   * Loads unit progresses for a specific unit
   */
  private loadUnitProgresses(unitId: string): Observable<UnitProgress[]> {
    return this.http.get<ApiResponse<UnitProgress[]>>(`${this.apiUrl}/units/${unitId}/unit-progresses`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error(`Error loading unit progresses for unit ${unitId}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Calculates comprehensive statistics from the data
   */
  private calculateStatistics(units: Unit[], students: Student[], unitProgresses: UnitProgress[]) {
    const totalStudents = students.length;
    const totalUnits = units.length;
    const totalTopics = units.reduce((sum, unit) => sum + (unit.assessments?.length || 0), 0);
    const totalHours = units.reduce((sum, unit) => sum + (unit.lessons?.length || 0) * 2, 0);

    // Calculate average progress
    const studentProgresses = students.map(student => student.levelProgressPercentage || 0);
    const averageProgress = studentProgresses.length > 0
      ? Math.round(studentProgresses.reduce((sum, progress) => sum + progress, 0) / studentProgresses.length)
      : 0;

    // Calculate progress statistics
    let completed = 0, inProgress = 0, notStarted = 0;
    unitProgresses.forEach((progress: UnitProgress) => {
      if (progress.completed) {
        completed++;
      } else if (progress.completionPercentage > 0) {
        inProgress++;
      } else {
        notStarted++;
      }
    });

    return {
      totalStudents,
      totalUnits,
      totalTopics,
      totalHours,
      averageProgress,
      progressStats: { completed, inProgress, notStarted }
    };
  }

  /**
   * Cache management methods
   */
  private getCachedData(key: string): LevelDetailCache | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    cached.isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    return cached.isExpired ? null : cached;
  }

  private cacheData(key: string, data: LevelDetailData): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      isExpired: false
    });
  }

  /**
   * Clears cache for a specific level or all cache
   */
  clearCache(levelId?: string): void {
    if (levelId) {
      this.cache.delete(`level_detail_${levelId}`);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Refreshes data for a specific level
   */
  refreshLevelDetails(levelId: string): Observable<LevelDetailData> {
    this.clearCache(levelId);
    return this.loadLevelDetails(levelId);
  }

  /**
   * Gets cached data without loading from server
   */
  getCachedLevelDetails(levelId: string): LevelDetailData | null {
    const cacheKey = `level_detail_${levelId}`;
    const cached = this.getCachedData(cacheKey);
    return cached && !cached.isExpired ? cached.data : null;
  }

  /**
   * Updates level details in cache and observable
   */
  updateLevelDetails(levelId: string, updates: Partial<LevelDetailData>): void {
    const cacheKey = `level_detail_${levelId}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      const updatedData = { ...cached.data, ...updates };
      this.cacheData(cacheKey, updatedData);
      this.levelDetailSubject.next(updatedData);
    }
  }
}
