import {AuthEffects} from "../auth/effects/auth.effects";
import {StudentsEffects} from "./students/students.effects";
import {UnitEffects} from "../course/effects/unit.effects";
import {LevelEffects} from "../course/effects/level.effects";
import {studentsFeature} from "./students/students.reducers";
import {levelsFeature} from "../course/reducers/level.reducer";
import {unitFeature} from "../course/reducers/unit.reducer";
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
import {CentersEffects} from "../corporate/center/centers.effects";
import {CenterFeature} from "../corporate/center/centers.reducer";
import {CenterState} from "../corporate/center/centerState";

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
    centers: CenterState;
}

export const AppEffects = [
    AuthEffects,
    CentersEffects,
    StudentsEffects,
    UnitEffects,
    LevelEffects,
    LessonsEffects,
    ClassEffects
]

export const AppFeatures = [
    studentsFeature,
    levelsFeature,
    unitFeature,
    CenterFeature,
    serviceFeature,
    authFeature,
    lessonsFeature,
    classesFeature
]
