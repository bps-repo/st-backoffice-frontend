import {InjectionToken, Injector} from "@angular/core";
import {Student} from "../../core/models/academic/student";


export function createTabDataToken<T>(description: string) {
    return new InjectionToken<T>(`TAB_DATA: ${description}`);
}


export const TAB_STUDENT_DATA = createTabDataToken<Student>('student');

