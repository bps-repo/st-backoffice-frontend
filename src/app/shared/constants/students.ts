import { GeneralComponent } from 'src/app/modules/schoolar/features/students/components/detail/tabs/general/general.component';
import { Tab } from '../@types/tab';
import { Observable, of } from 'rxjs';
import { ClassesComponent } from 'src/app/modules/schoolar/features/students/components/detail/tabs/classes/classes.component';
import { InvoicesComponent } from 'src/app/modules/schoolar/features/students/components/detail/tabs/invoices/invoices.component';
import { CoursesComponent } from 'src/app/modules/schoolar/features/students/components/detail/tabs/courses/courses.component';
import { LessonsComponent } from 'src/app/modules/schoolar/features/students/components/detail/tabs/lessons/lessons.component';

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
        template: LessonsComponent,
    },

    {
        header: 'Turmas',
        icon: 'pi pi-wallet',
        title: 'Overview ',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: ClassesComponent,
    },
    {
        header: 'Cursos',
        icon: 'pi pi-wallet',
        title: 'Overview ',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: CoursesComponent,
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
        template: InvoicesComponent,
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
