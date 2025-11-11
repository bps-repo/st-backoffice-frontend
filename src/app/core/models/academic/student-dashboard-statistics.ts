export interface StudentDashboardStatistics {
  totalStudents: number;
  studentsByStatus: Record<string, number>;
  studentsByGender: Record<string, number>;
  studentsByProvince: Record<string, number>;
  studentsByMunicipality: Record<string, Record<string, number>>;
  studentsByAgeRange: Record<string, number>;
  studentsByAcademicBackground: Record<string, number>;
}

