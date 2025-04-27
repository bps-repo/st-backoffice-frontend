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
import { InputNumberModule } from 'primeng/inputnumber';

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
        InputNumberModule
    ],
    templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
    classId: string | null = null;
    class: any = {
        id: 1,
        name: 'English Beginner',
        code: 'ENG101',
        level: { label: 'Beginner', value: 'Beginner' },
        teacher: { label: 'John Smith', value: 'John Smith' },
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-06-30'),
        schedule: 'Mon, Wed 18:00-19:30',
        capacity: 15,
        status: { label: 'Active', value: 'Active' }
    };

    levels = [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' }
    ];

    teachers = [
        { label: 'John Smith', value: 'John Smith' },
        { label: 'Jane Doe', value: 'Jane Doe' },
        { label: 'Maria Rodriguez', value: 'Maria Rodriguez' },
        { label: 'Pierre Dupont', value: 'Pierre Dupont' }
    ];

    statuses = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' }
    ];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.classId = this.route.snapshot.paramMap.get('id');
        // In a real application, you would fetch the class data from a service
        // this.classService.getClass(this.classId).subscribe(data => {
        //     this.class = data;
        // });
    }

    saveClass() {
        // In a real application, you would save the class data using a service
        console.log('Class updated:', this.class);
        // Navigate back to the detail page
    }
}
