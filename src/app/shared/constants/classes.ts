import {GeneralComponent} from 'src/app/features/schoolar/features/lessons/pages/detail/tabs/general/general.component';
import {
    StudentsComponent
} from 'src/app/features/schoolar/features/lessons/pages/detail/tabs/students/students.component';

import {Tab} from '../@types/tab';

import {Observable, of} from 'rxjs';

import {LessonsComponent} from "../../features/schoolar/features/lessons/pages/detail/tabs/lessons/lessons.component";

export const CLASSES_TABS: Observable<Tab[]> = of([
    {
        header: 'Geral',
        icon: 'pi pi-info-circle',
        title: 'Class Overview',
        description: 'View general information about the class',
        template: GeneralComponent,
    },
    {
        header: 'Estudantes',
        icon: 'pi pi-users',
        title: 'Enrolled Students',
        description: 'Manage students enrolled in this class',
        template: StudentsComponent,
    },
    {
        header: 'Presenças',
        icon: 'pi pi-check',
        title: 'Class Attendance',
        description: 'Manage attendance records for this class',
        template: LessonsComponent,
    }
]);
