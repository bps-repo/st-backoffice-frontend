import { GeneralComponent } from 'src/app/features/schoolar/features/reviews/pages/detail/tabs/general/general.component';
import { StudentsComponent } from 'src/app/features/schoolar/features/reviews/pages/detail/tabs/students/students.component';
import { ScoresComponent } from 'src/app/features/schoolar/features/reviews/pages/detail/tabs/scores/scores.component';
import { Tab } from '../@types/tab';
import { Observable, of } from 'rxjs';

export const REVIEWS_TABS: Observable<Tab[]> = of([
    {
        header: 'General Information',
        icon: 'pi pi-info-circle',
        title: 'Evaluation Overview',
        description: 'View general information about the evaluation',
        template: GeneralComponent,
    },
    {
        header: 'Students',
        icon: 'pi pi-users',
        title: 'Evaluated Students',
        description: 'View students who took this evaluation',
        template: StudentsComponent,
    },
    {
        header: 'Scores',
        icon: 'pi pi-chart-bar',
        title: 'Evaluation Scores',
        description: 'View detailed scores and analytics',
        template: ScoresComponent,
    }
]);
