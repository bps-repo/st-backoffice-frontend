import {AuthEffects} from "../auth/effects/auth.effects";
import {CenterEffects} from "../corporate/effects/center.effects";
import {ServiceEffects} from "../course/effects/service.effects";
import {StudentsEffects} from "./students/students.effects";
import {UnitEffects} from "../course/effects/unit.effects";
import {LevelEffects} from "../course/effects/level.effects";
import {studentsFeature} from "./students/students.reducers";
import {levelsFeature} from "../course/reducers/level.reducer";
import {unitFeature} from "../course/reducers/unit.reducer";
import {centerFeature} from "../corporate/reducers/center.reducer";
import {serviceFeature} from "../course/reducers/service.reducer";
import {authFeature} from "../auth/reducers/auth.reducers";
import {LessonsEffects} from "./lessons/lessons.effects";
import {lessonsFeature} from "./lessons/lessons.feature";
import {StudentState} from "./students/student.state";
import {ClassState} from "./classes/classState";
import {LessonState} from "./lessons/lessonState";
import {
    CalendarsState,
    CertificatesState,
    EntitiesState,
    MaterialsState,
    ReportsState,
    ReviewsState, SettingsState
} from "./app.state";
import {ClassEffects} from "./classes/classes.effects";
import {classesFeature} from "./classes/classes.feature";

export interface AppState {
    students: StudentState;
    classes: ClassState;
    calendars: CalendarsState;
    entities: EntitiesState;
    reviews: ReviewsState;
    materials: MaterialsState;
    certificates: CertificatesState;
    reports: ReportsState;
    settings: SettingsState;
    lessons: LessonState;
}

export const AppEffects = [
    AuthEffects,
    CenterEffects,
    ServiceEffects,
    StudentsEffects,
    UnitEffects,
    ServiceEffects,
    LevelEffects,
    LessonsEffects,
    ClassEffects
]

export const AppFeatures = [
    studentsFeature,
    levelsFeature,
    unitFeature,
    centerFeature,
    serviceFeature,
    authFeature,
    lessonsFeature,
    classesFeature
]
