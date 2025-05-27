import { GeneralComponent } from 'src/app/features/schoolar/features/students/pages/detail/tabs/general/general.component';
import { Tab } from '../@types/tab';
import { Observable, of } from 'rxjs';
import { ClassesComponent } from 'src/app/features/schoolar/features/students/pages/detail/tabs/classes/classes.component';
import { InvoicesComponent } from 'src/app/features/schoolar/features/students/pages/detail/tabs/invoices/invoices.component';
import { CoursesComponent } from 'src/app/features/schoolar/features/students/pages/detail/tabs/courses/courses.component';
import { TurmasComponent } from 'src/app/features/schoolar/features/students/pages/detail/tabs/turmas/turmas.component';
import { AvaliacoesComponent } from 'src/app/features/schoolar/features/students/pages/detail/tabs/avaliacoes/avaliacoes.component';
import { DocumentosComponent } from 'src/app/features/schoolar/features/students/pages/detail/tabs/documentos/documentos.component';
import { AcessoPortalComponent } from 'src/app/features/schoolar/features/students/pages/detail/tabs/acesso-portal/acesso-portal.component';
import { PagamentosComponent } from 'src/app/features/schoolar/features/students/pages/detail/tabs/pagamentos/pagamentos.component';
import {HistoryComponent} from "../../features/schoolar/features/students/pages/detail/tabs/history/history.component";

export const STUDENTS_TABS: Observable<Tab[]> = of([
    {
        header: 'Visualização geral do Aluno',
        icon: 'pi pi-th-large',
        title: 'Overview ',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: GeneralComponent,
    },
    {
        header: 'Histórico',
        icon: 'pi pi-history',
        title: 'Histórico do Aluno',
        description: 'Histórico acadêmico e atividades do aluno',
        template: HistoryComponent,
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
        icon: 'pi pi-users',
        title: 'Suas Turmas',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: TurmasComponent,
    },
    {
        header: 'Cursos',
        icon: 'pi pi-book',
        title: 'Seus Cursos',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: CoursesComponent,
    },
    {
        header: 'Avaliações',
        icon: 'pi pi-chart-bar',
        title: 'Suas Avaliações',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: AvaliacoesComponent,
    },
    {
        header: 'Facturas',
        icon: 'pi pi-file',
        title: 'Suas Facturas',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: InvoicesComponent,
    },
    {
        header: 'Documentos',
        icon: 'pi pi-file-pdf',
        title: 'Seus Documentos',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: DocumentosComponent,
    },
    {
        header: 'Acesso ao Portal',
        icon: 'pi pi-desktop',
        title: 'Acesso ao Portal',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: AcessoPortalComponent,
    },
    {
        header: 'Pagamentos',
        icon: 'pi pi-money-bill',
        title: 'Seus Pagamentos',
        description: 'Volutpat maecenas volutpat blandit aliquam etiam erat',
        template: PagamentosComponent,
    },
]);
