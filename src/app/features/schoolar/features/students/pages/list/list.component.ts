import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import { Student } from 'src/app/core/models/academic/student';
import { TableService } from 'src/app/shared/services/table.service';
import { Store } from '@ngrx/store';
import {
    studentsActions,
    selectAllStudents,
    selectLoading
} from 'src/app/core/store/schoolar';
import { Observable, Subject, takeUntil } from 'rxjs';

type studentKeys = keyof Student;

@Component({
    selector: 'app-list',
    imports: [
        CommonModule,
        RouterModule,
        GlobalTable
    ],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
    students$: Observable<Student[]>;
    loading$: Observable<boolean>;

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['id', 'name', 'center', 'level', 'phone'];

    private destroy$ = new Subject<void>();

    constructor(
        private tableService: TableService<Student>,
        private store: Store
    ) {
        // Use the entity selectors
        this.students$ = this.store.select(selectAllStudents);
        this.loading$ = this.store.select(selectLoading);
    }

    ngOnInit(): void {
        // Dispatch action to load students
        this.store.dispatch(studentsActions.loadStudents());

        // Define custom column templates for different filter types
        this.columns = [
            {
                field: 'id',
                header: 'Nº',
                filterType: 'text',
            },
            {
                field: 'name',
                header: 'Nome',
                filterType: 'text',
            },
            {
                field: 'center',
                header: 'Centro',
                filterType: 'text',
            },
            {
                field: 'level',
                header: 'Nível',
                filterType: 'text',
            },
            {
                field: 'phone',
                header: 'Telefone',
                filterType: 'text',
            },
        ];
    }

    /**
     * Navigate to student detail
     * @param student The selected student
     */
    onRowSelect(student: Student): void {
        // You can use the router to navigate to the student detail page
        // this.router.navigate(['/schoolar/students', student.id]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
