import {Component, OnInit, OnDestroy, TemplateRef, ContentChild, ViewChild, AfterViewInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Student} from 'src/app/core/models/academic/student';
import {Store} from '@ngrx/store';

import {Observable, Subject} from 'rxjs';
import {ChartModule} from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import {COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS} from "../../constants";
import {TableHeaderAction} from "../../../../../../shared/components/tables/global-table/table-header.component";
import * as StudentSelectors from "../../../../../../core/store/schoolar/students/students.selectors";
import {StudentsActions} from "../../../../../../core/store/schoolar/students/students.actions";
import {StudentState} from "../../../../../../core/store/schoolar/students/student.state";

@Component({
    selector: 'app-general',
    imports: [
        CommonModule,
        RouterModule,
        GlobalTable,
        ChartModule,
        ButtonModule
    ],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {

    // Custom Templates for the table
    @ViewChild('nameTemplate', {static: true})
    nameTemplate!: TemplateRef<any>;

    @ViewChild('dateOfBirthTemplate', {static: true})
    dateOfBirthTemplate!: TemplateRef<any>;

    @ViewChild('emailTemplate', {static: true})
    emailTemplate!: TemplateRef<any>;

    @ViewChild('phoneTemplate', {static: true})
    phoneTemplate!: TemplateRef<any>;


    students$?: Observable<Student[]>;

    loading$: Observable<boolean>;

    columns: TableColumn[] = COLUMNS;

    globalFilterFields: string[] = GLOBAL_FILTERS;

    customTemplates: Record<string, TemplateRef<any>> = {};

    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    chartOptions: any;

    private destroy$ = new Subject<void>();

    constructor(
        private store: Store<StudentState>,
        private router: Router
    ) {
        // Use the entity selectors
        this.students$ = this.store.select(StudentSelectors.selectAllStudents)

        this.loading$ = this.store.select(StudentSelectors.selectLoading);

        this.store.select(StudentSelectors.selectIds).subscribe(selectedStudentIds => {
            console.log(selectedStudentIds)
        })

        // Initialize chart options
        this.chartOptions = {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#495057'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };
    }

    ngOnInit(): void {
        // Dispatch action to load students
        this.store.dispatch(StudentsActions.loadStudents());
        this.headerActions.push(
            {
                label: "Adicionar ao Centro",
                icon: "pi pi-plus",
                command: () => this.router.navigate(['/schoolar/students/add-to-center']),
            },
            {
                label: 'Adicionar à turma',
                icon: 'pi pi-plus',
                command: () => this.router.navigate(['/schoolar/students/add-to-class']).then(r => null)
            },
            {
                label: "Criar contracto",
                icon: "pi pi-file",
                command: () => this.router.navigate(['/schoolar/students/create-contract']),
            },
        )
    }

    ngAfterViewInit() {
        this.customTemplates = {
            name: this.nameTemplate,
            dateOfBirth: this.dateOfBirthTemplate,
            email: this.emailTemplate
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRowSelect($event: Student) {
        this.router.navigate(['/schoolar/students', $event.id]);
    }

    navigateToCreateStudent() {
        this.router.navigate(['/schoolar/students/create']);
    }
}
