import { InjectionToken } from '@angular/core';
import { Assessment } from 'src/app/core/models/academic/assessment';

export const ASSESSMENT_DETAIL_TOKEN = new InjectionToken<Assessment>('assessment-detail');
