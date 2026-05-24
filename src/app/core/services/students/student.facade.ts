import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StudentService } from '../student.service';
import { Student } from '../../models/academic/students/student';

@Injectable({ providedIn: 'root' })
export class StudentFacade {
    private studentService = inject(StudentService);

    loading = signal(false);
    error = signal<string | null>(null);
    students = signal<Student[]>([]);
    totalElements = signal(0);

    activeStudents = computed(() =>
        this.students().filter(s => s.status === 'ACTIVE')
    );

    async loadStudents(
        filters: Parameters<StudentService['searchStudents']>[0] = {}
    ): Promise<void> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const result = await firstValueFrom(
                this.studentService.searchStudents(filters)
            );
            this.students.set(result ?? []);
        } catch (err: any) {
            this.error.set(err?.error?.message ?? err?.message ?? 'Erro ao carregar alunos');
        } finally {
            this.loading.set(false);
        }
    }

    async loadStudentsPaginated(
        filters: Parameters<StudentService['searchStudentsPaginated']>[0] = {},
        page = 0,
        size = 10,
        sort?: string
    ): Promise<void> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const result = await firstValueFrom(
                this.studentService.searchStudentsPaginated(filters, page, size, sort)
            );
            this.students.set(result.content ?? []);
            this.totalElements.set(result.totalElements ?? 0);
        } catch (err: any) {
            this.error.set(err?.error?.message ?? err?.message ?? 'Erro ao carregar alunos');
        } finally {
            this.loading.set(false);
        }
    }

    async getStudent(id: string): Promise<Student | null> {
        this.loading.set(true);
        this.error.set(null);
        try {
            return await firstValueFrom(this.studentService.getStudent(id));
        } catch (err: any) {
            this.error.set(err?.error?.message ?? err?.message ?? 'Erro ao carregar aluno');
            return null;
        } finally {
            this.loading.set(false);
        }
    }

    async updateStudentPhoto(studentId: string, photoFile: File): Promise<Student | null> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const student = await firstValueFrom(
                this.studentService.updateStudentPhoto(studentId, photoFile)
            );
            return student;
        } catch (err: any) {
            this.error.set(
                err?.error?.message ?? err?.message ?? 'Erro ao atualizar foto do aluno'
            );
            return null;
        } finally {
            this.loading.set(false);
        }
    }
}
