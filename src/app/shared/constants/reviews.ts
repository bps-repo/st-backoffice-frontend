import { Tab } from '../@types/tab';
import { GeneralComponent } from '../../features/schoolar/features/assessments/pages/detail/tabs/general/general.component';
import { StudentsComponent } from '../../features/schoolar/features/assessments/pages/detail/tabs/students/students.component';
import { ScoresComponent } from '../../features/schoolar/features/assessments/pages/detail/tabs/scores/scores.component';
import { HistoryComponent } from '../../features/schoolar/features/assessments/pages/detail/tabs/history/history.component';
import { ASSESSMENT_DETAIL_TOKEN } from '../tokens/assessment-detail.token';

export const ASSESSMENTS_TABS: Tab[] = [
    {
        header: 'Visão Geral',
        icon: 'pi pi-info-circle',
        title: 'Informações Gerais',
        description: 'Informações gerais da avaliação',
        template: GeneralComponent,
        data: { token: ASSESSMENT_DETAIL_TOKEN },
    },
    {
        header: 'Alunos',
        icon: 'pi pi-users',
        title: 'Alunos Avaliados',
        description: 'Alunos que realizaram esta avaliação',
        template: StudentsComponent,
        data: { token: ASSESSMENT_DETAIL_TOKEN },
    },
    {
        header: 'Histórico',
        icon: 'pi pi-history',
        title: 'Histórico de Tentativas',
        description: 'Todas as tentativas registadas para esta avaliação',
        template: HistoryComponent,
        data: { token: ASSESSMENT_DETAIL_TOKEN },
    },
];
