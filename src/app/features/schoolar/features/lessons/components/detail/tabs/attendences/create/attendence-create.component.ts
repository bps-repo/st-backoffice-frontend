import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'app-create',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        TableModule,
        SelectButtonModule
    ],
    templateUrl: './attendence-create.component.html'
})
export class AttendenceCreateComponent {
    date: Date = new Date();
    selectedClass: any = null;
    classes: any[] = [
        { name: 'English Beginner', code: 'ENG101' },
        { name: 'English Intermediate', code: 'ENG201' },
        { name: 'Spanish Beginner', code: 'SPA101' }
    ];

    students: any[] = [
        { id: 1, name: 'John Doe', status: 'Present', notes: '' },
        { id: 2, name: 'Jane Smith', status: 'Present', notes: '' },
        { id: 3, name: 'Michael Johnson', status: 'Present', notes: '' },
        { id: 4, name: 'Emily Brown', status: 'Present', notes: '' },
        { id: 5, name: 'David Wilson', status: 'Present', notes: '' }
    ];

    statusOptions: any[] = [
        { label: 'Present', value: 'Present' },
        { label: 'Absent', value: 'Absent' },
        { label: 'Late', value: 'Late' },
        { label: 'Excused', value: 'Excused' }
    ];

    saveAttendance() {
        console.log('Saving attendance for class:', this.selectedClass);
        console.log('Date:', this.date);
        console.log('Students:', this.students);
        // In a real application, this would send the data to a service
    }
}
