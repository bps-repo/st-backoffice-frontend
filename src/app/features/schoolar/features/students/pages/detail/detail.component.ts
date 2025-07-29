import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {Tab} from 'src/app/shared/@types/tab';
import {STUDENTS_TABS} from 'src/app/shared/constants/students';
import {Observable, Subscription} from 'rxjs';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute} from '@angular/router';
import {Store} from "@ngrx/store";
import {StudentsActions} from "../../../../../../core/store/schoolar/students/students.actions";
import {selectStudentById} from "../../../../../../core/store/schoolar/students/students.selectors";
import {Student} from "../../../../../../core/models/academic/student";
import {TabViewComponent} from "../../../../../../shared/components/tables/tab-view/tab-view.component";

@Component({
    selector: 'app-student',
    imports: [
        TabMenuModule,
        TabViewModule,
        CommonModule,
        SplitButtonModule,
        TabViewComponent,
    ],
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit, OnDestroy {
    tabs: Tab<Student>[] = STUDENTS_TABS;
    items!: MenuItem[];
    studentId!: string;
    student$?: Observable<Student | null>;
    private subscriptions = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private store$: Store
    ) {}

    ngOnInit() {
        this.subscriptions.add(
            this.route.params.subscribe(params => {
                this.studentId = params['id'];
                if (this.studentId) {
                    // Dispatch action to load student
                    this.store$.dispatch(StudentsActions.loadStudent({id: this.studentId}));

                    // Set up selector for this student
                    this.student$ = this.store$.select(selectStudentById(this.studentId));
                }
            })
        );

        this.items = [
            {label: 'Imprimir cartão', icon: 'pi pi-file-pdf'},
            {
                label: 'Ficha de Inscrição',
                icon: 'pi pi-file-pdf',
                items: [
                    {label: 'Gerar', icon: 'pi pi-plus'},
                    {label: 'Imprimir', icon: 'pi pi-file-pdf'},
                    {label: 'Enviar por e-mais', icon: 'pi pi-at'},
                ],
            },
            {label: 'Inscrição turma', icon: 'pi pi-user-edit'},
            {label: 'Enviar mensagem', icon: 'pi pi-comments'},
            {separator: true},
            {label: 'Actualizar', icon: 'pi pi-user-edit'},
            {
                label: 'Inactivar',
                icon: 'pi pi-times',
                styleClass: 'text-red-500',
                tooltip: 'Desactivar o aluno',
            },
        ];
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
