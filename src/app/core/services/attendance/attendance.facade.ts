import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AttendanceService } from '../attendance.service';
import { Attendance } from '../../models/academic/attendance';
import { AttendanceStatusUpdate } from '../../models/academic/attendance-update';

@Injectable({ providedIn: 'root' })
export class AttendanceFacade {
    private attendanceService = inject(AttendanceService);

    loading = signal(false);
    error = signal<string | null>(null);
    attendances = signal<Attendance[]>([]);

    async loadByLesson(lessonId: string): Promise<void> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const result = await firstValueFrom(
                this.attendanceService.getAttendancesByLessonId(lessonId)
            );
            this.attendances.set(result ?? []);
        } catch (err: any) {
            this.error.set(err?.error?.message ?? err?.message ?? 'Erro ao carregar presenças');
        } finally {
            this.loading.set(false);
        }
    }

    async updateStatus(id: string, statusUpdate: AttendanceStatusUpdate): Promise<Attendance | null> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const updated = await firstValueFrom(
                this.attendanceService.updateAttendanceStatus(id, statusUpdate)
            );
            this.attendances.update(list =>
                list.map(a => a.id === id ? { ...a, ...updated } : a)
            );
            return updated;
        } catch (err: any) {
            this.error.set(err?.error?.message ?? err?.message ?? 'Erro ao atualizar presença');
            return null;
        } finally {
            this.loading.set(false);
        }
    }

    clear(): void {
        this.attendances.set([]);
        this.error.set(null);
    }
}
