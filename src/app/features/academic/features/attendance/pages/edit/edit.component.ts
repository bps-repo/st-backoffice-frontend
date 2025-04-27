import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'app-edit',
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
    templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
    attendanceId: string | null = null;
    date: Date = new Date();
    selectedClass: any = { name: 'English Intermediate', code: 'ENG201' };
    classes: any[] = [
        { name: 'English Beginner', code: 'ENG101' },
        { name: 'English Intermediate', code: 'ENG201' },
        { name: 'Spanish Beginner', code: 'SPA101' }
    ];

    students: any[] = [
        { id: 1, name: 'John Doe', status: 'Present', notes: 'Arrived on time' },
        { id: 2, name: 'Jane Smith', status: 'Absent', notes: 'Sick leave' },
        { id: 3, name: 'Michael Johnson', status: 'Present', notes: '' },
        { id: 4, name: 'Emily Brown', status: 'Late', notes: 'Arrived 10 minutes late' },
        { id: 5, name: 'David Wilson', status: 'Present', notes: '' }
    ];

    statusOptions: any[] = [
        { label: 'Present', value: 'Present' },
        { label: 'Absent', value: 'Absent' },
        { label: 'Late', value: 'Late' },
        { label: 'Excused', value: 'Excused' }
    ];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.attendanceId = this.route.snapshot.paramMap.get('id');
        // In a real application, you would fetch the attendance data from a service
        // this.attendanceService.getAttendance(this.attendanceId).subscribe(data => {
        //     this.date = new Date(data.date);
        //     this.selectedClass = data.class;
        //     this.students = data.students;
        // });
    }

    saveAttendance() {
        console.log('Updating attendance record:', this.attendanceId);
        console.log('Class:', this.selectedClass);
        console.log('Date:', this.date);
        console.log('Students:', this.students);
        // In a real application, this would send the data to a service
    }
}
