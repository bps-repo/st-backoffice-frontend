import {GeneralComponent} from 'src/app/features/schoolar/features/lessons/pages/detail/tabs/general/general.component';
import {
    StudentsComponent
} from 'src/app/features/schoolar/features/lessons/pages/detail/tabs/students/students.component';

import {Tab} from '../@types/tab';

import {Observable, of} from 'rxjs';

import {
    MaterialsComponent
} from "../../features/schoolar/features/lessons/pages/detail/tabs/materials/materials.component";
import {
    AttendanceComponent
} from "../../features/schoolar/features/lessons/pages/detail/tabs/attendences/list/attendance.component";

export const LESSONS_TABS: Tab[] = [
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
        template: AttendanceComponent,
    },
    {
        header: 'Materiais',
        icon: 'pi pi-book',
        title: 'Lesson Materials',
        description: 'Manage materials-dashboard for this lesson',
        template: MaterialsComponent,
    }
];
