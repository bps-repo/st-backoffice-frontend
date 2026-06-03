export interface StudentDashboardStatistics {
  totalStudents: number;
  studentsByStatus: Record<string, number>;
  studentsByGender: Record<string, number>;
  studentsByProvince: Record<string, number>;
  studentsByMunicipality: Record<string, Record<string, number>>;
  studentsByAgeRange: Record<string, number>;
  studentsByAcademicBackground: Record<string, number>;
  studentsByLevel: Record<string, number>;
  studentsByCenter: Record<string, number>;
  /** 12-element array, index 0 = January … 11 = December, for the current calendar year */
  enrollmentsByMonth?: number[];
}

