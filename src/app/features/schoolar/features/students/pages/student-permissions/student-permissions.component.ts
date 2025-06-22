import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Student} from 'src/app/core/models/academic/student';
import {Permission} from 'src/app/core/models/auth/permission';
import {StudentService} from 'src/app/core/services/student.service';
import {PermissionService} from 'src/app/core/services/permission.service';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-student-permissions',
    templateUrl: './student-permissions.component.html',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterLink,
        NgIf,
        NgForOf
    ],
})
export class StudentPermissionsComponent implements OnInit {
    student: Student | null = null;
    studentId?: string;
    permissions: Permission[] = [];
    studentPermissions: Permission[] = [];
    selectedPermission: Permission | null = null;

    constructor(
        private route: ActivatedRoute,
        private studentsService: StudentService,
        private permissionService: PermissionService
    ) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.studentId = params['id'];
            this.loadStudent();
            this.loadPermissions();
        });
    }

    loadStudent(): void {
        this.studentsService.getStudent(this.studentId!).subscribe(student => {
            this.student = student;
        });
    }

    loadPermissions(): void {
        this.permissionService.getPermissions().subscribe(permissions => {
            this.permissions = permissions;
        });
    }


    selectPermission(permission: Permission): void {
        this.selectedPermission = permission;
    }
}
