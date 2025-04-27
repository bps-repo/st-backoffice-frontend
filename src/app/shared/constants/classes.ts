import { GeneralComponent } from 'src/app/features/schoolar/features/classes/pages/detail/tabs/general/general.component';
import { StudentsComponent } from 'src/app/features/schoolar/features/classes/pages/detail/tabs/students/students.component';
import { LessonsComponent } from 'src/app/features/schoolar/features/classes/pages/detail/tabs/lessons/lessons.component';
import { Tab } from '../@types/tab';
import { Observable, of } from 'rxjs';

export const CLASSES_TABS: Observable<Tab[]> = of([
    {
        header: 'General Information',
        icon: 'pi pi-info-circle',
        title: 'Class Overview',
        description: 'View general information about the class',
        template: GeneralComponent,
    },
    {
        header: 'Students',
        icon: 'pi pi-users',
        title: 'Enrolled Students',
        description: 'Manage students enrolled in this class',
        template: StudentsComponent,
    },
    {
        header: 'Lessons',
        icon: 'pi pi-calendar',
        title: 'Class Lessons',
        description: 'View and manage lessons for this class',
        template: LessonsComponent,
    }
]);
