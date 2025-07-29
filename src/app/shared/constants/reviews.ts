import {Tab} from '../@types/tab';
import {Observable, of} from 'rxjs';
import {GeneralComponent} from "../../features/schoolar/features/lessons/pages/detail/tabs/general/general.component";
import {
    StudentsComponent
} from "../../features/schoolar/features/lessons/pages/detail/tabs/students/students.component";
import {ScoresComponent} from "../../features/schoolar/features/assessments/pages/detail/tabs/scores/scores.component";
import {STUDENT_DATA} from "../tokens/student.token";

export const ASSESSMENTS_TABS: Tab[] = [
    {
        header: 'student Information',
        icon: 'pi pi-info-circle',
        title: 'Evaluation Overview',
        description: 'View general information about the evaluation',
        template: GeneralComponent,
        data: { token: STUDENT_DATA }
    },
    {
        header: 'Students',
        icon: 'pi pi-users',
        title: 'Evaluated Students',
        description: 'View students who took this evaluation',
        template: StudentsComponent,
        data: { token: STUDENT_DATA }
    },
    {
        header: 'Scores',
        icon: 'pi pi-chart-bar',
        title: 'Evaluation Scores',
        description: 'View detailed scores and analytics',
        template: ScoresComponent,
        data: { token: STUDENT_DATA }
    }
];
