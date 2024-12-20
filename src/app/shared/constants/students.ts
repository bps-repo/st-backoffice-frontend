import { GeneralComponent } from 'src/app/modules/schoolar/features/students/components/tabs/general/general.component';
import { Tab } from '../@types/tab';
import { ClassesComponent } from 'src/app/modules/schoolar/features/classes/components/classes/classes.component';
import { Observable, of } from 'rxjs';

export const STUDENTS_TABS: Observable<Tab[]> = of([
    {
        header: 'Visualização geral do Aluno',
        icon: 'pi pi-th-large',
        title: 'Overview ',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: GeneralComponent,
    },
    {
        header: 'Aulas',
        icon: 'pi pi-wallet',
        title: 'Suas Aulas',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: ClassesComponent,
    },

    {
        header: 'Turmas',
        icon: 'pi pi-wallet',
        title: 'Overview ',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: GeneralComponent,
    },
    {
        header: 'Aulas',
        icon: 'pi pi-wallet',
        title: 'Suas Aulas',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: ClassesComponent,
    },
    {
        header: 'Cursos',
        icon: 'pi pi-wallet',
        title: 'Overview ',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: GeneralComponent,
    },
    {
        header: 'Avaliações',
        icon: 'pi pi-wallet',
        title: 'Overview ',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: GeneralComponent,
    },
    {
        header: 'Facturas',
        icon: 'pi pi-file',
        title: 'Overview ',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: GeneralComponent,
    },
    {
        header: 'Documentos',
        icon: 'pi pi-file-pdf',
        title: 'Suas Aulas',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: ClassesComponent,
    },
    {
        header: 'Acesso ao Portal',
        icon: 'pi pi-th-large',
        title: 'Suas Aulas',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: ClassesComponent,
    },
    {
        header: 'Pagamentos',
        icon: 'pi pi-money-bill',
        title: 'Overview ',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: GeneralComponent,
    },
]);
