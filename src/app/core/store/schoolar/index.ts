import {AuthEffects} from "../auth/effects/auth.effects";
import {StudentsEffects} from "./students/students.effects";
import {studentsFeature} from "./students/students.reducers";
import {authFeature} from "../auth/reducers/auth.reducers";
import {LessonsEffects} from "./lessons/lessons.effects";
import {lessonsFeature} from "./lessons/lessons.feature";
import {StudentState} from "./students/student.state";
import {ClassState} from "./classes/classState";
import {LessonState} from "./lessons/lesson.state";
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
import {CenterState} from "../corporate/center/center.state";
import {UnitEffects} from "./units/unit.effects";
import {LevelEffects} from "./level/level.effects";
import {serviceFeature} from "../corporate/services/service.reducer";
import {unitFeature} from "./units/unit.feature";
import {levelsFeature} from "./level/level.reducer";
import {RolesEffects} from "../roles/effects/roles.effects";
import {PermissionsEffects} from "../permissions/effects/permissions.effects";
import {rolesFeature} from "../roles/roles.feature";
import {permissionsFeature} from "../permissions/permissions.feature";
import {RolesState} from "../roles/models/roles.state";
import {PermissionsState} from "../permissions/models/permissions.state";
import {EmployeesEffects} from "../corporate/employees/employees.effects";
import {employeesFeature} from "../corporate/employees/employees.feature";
import {EmployeesState} from "../corporate/employees/employees.state";

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
    roles: RolesState;
    permissions: PermissionsState;
    employees: EmployeesState;
}

export const AppEffects = [
    AuthEffects,
    CentersEffects,
    StudentsEffects,
    UnitEffects,
    LevelEffects,
    LessonsEffects,
    ClassEffects,
    RolesEffects,
    PermissionsEffects,
    EmployeesEffects
]

export const AppFeatures = [
    studentsFeature,
    levelsFeature,
    unitFeature,
    CenterFeature,
    serviceFeature,
    authFeature,
    lessonsFeature,
    classesFeature,
    rolesFeature,
    permissionsFeature,
    employeesFeature
]
