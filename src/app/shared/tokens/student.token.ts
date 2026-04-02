import { InjectionToken } from '@angular/core';
import { Student } from 'src/app/core/models/academic/students/student';

export const STUDENT_DATA = new InjectionToken<Student>('student-data');
