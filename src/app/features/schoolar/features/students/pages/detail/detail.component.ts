import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {Tab} from 'src/app/shared/@types/tab';
import {TabViewComponent} from 'src/app/shared/components/tables/tab-view/tab-view.component';
import {STUDENTS_TABS} from 'src/app/shared/constants/students';
import {Observable} from 'rxjs';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from "@ngrx/store";
import {StudentsActions} from "../../../../../../core/store/schoolar/students/studentsActions";
import {selectSelectedStudent} from "../../../../../../core/store/schoolar/students/students.selectors";

@Component({
    selector: 'app-detail',
    imports: [
        TabMenuModule,
        TabViewModule,
        CommonModule,
        TabViewComponent,
        SplitButtonModule,
    ],
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
    tabs!: Observable<Tab[]>;
    items!: MenuItem[];
    studentId!: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store$: Store
    ) {
        this.store$.select(selectSelectedStudent).subscribe(student => {
            if (student) {
                this.studentId = student
            }
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.studentId = params['id'];
        });
        this.tabs = STUDENTS_TABS;
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
            {
                label: 'Gerir permissões',
                icon: 'pi pi-key',
                command: () => {
                    this.router.navigate(['/schoolar/students', this.studentId, 'permissions']);
                }
            },
            {separator: true},
            {label: 'Actualizar', icon: 'pi pi-user-edit'},
            {
                label: 'Inactivar',
                icon: 'pi pi-times',
                styleClass: 'text-red-500',
                tooltip: 'Desactivar o aluno',
            },
        ];

        this.store$.dispatch(StudentsActions.loadStudent({id: this.studentId}));
    }
}
