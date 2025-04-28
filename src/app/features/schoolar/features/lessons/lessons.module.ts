import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonsRoutes } from './lessons-routes.module';
import { CreateLessonDialogComponent } from './dialogs/create-lesson-dialog/create-lesson-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        LessonsRoutes,
        CreateLessonDialogComponent
    ],
    declarations: [],
})
export class LessonsModule {}
