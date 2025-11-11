export interface LessonsDashboardStatistics {
  totalLessons: number;
  lessonsByStatus: Record<string, number>;
  lessonsByCenter: Record<string, number>;
  lessonsByLevel: Record<string, number>;
  lessonsByUnit: Record<string, Record<string, number>>;
  lessonsByOnline: Record<string, number>;
  lessonsByType: Record<string, number>;
  lessonsByAttendance: Record<string, number>;
}

