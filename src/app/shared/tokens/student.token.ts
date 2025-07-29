import { InjectionToken } from '@angular/core';
import { Student } from 'src/app/core/models/academic/student';

export const STUDENT_DATA = new InjectionToken<Student>('student-data');
