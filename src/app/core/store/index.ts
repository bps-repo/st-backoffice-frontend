import {AuthEffects} from "./auth/auth.effects";
import {StudentsEffects} from "./schoolar/students/students.effects";
import {studentsFeature} from "./schoolar/students/students.reducers";
import {authFeature} from "./auth/auth.reducers";
import {LessonsEffects} from "./schoolar/lessons/lessons.effects";
import {lessonsFeature} from "./schoolar/lessons/lessons.feature";
import {StudentState} from "./schoolar/students/student.state";
import {LessonState} from "./schoolar/lessons/lesson.state";
import {
    CalendarsState,
    CertificatesState,
    EntitiesState,
    MaterialsState,
    ReportsState,
    ReviewsState, SettingsState
} from "./schoolar/app.state";
import {CenterFeature} from "./corporate/center/centers.reducer";
import {CenterState} from "./corporate/center/center.state";
import {UnitEffects} from "./schoolar/units/unit.effects";
import {LevelEffects} from "./schoolar/level/level.effects";
import {serviceFeature} from "./corporate/services/service.reducer";
import {unitFeature} from "./schoolar/units/unit.feature";
import {levelsFeature} from "./schoolar/level/level.reducer";
import {RolesEffects} from "./roles/roles.effects";
import {PermissionsEffects} from "./permissions/effects/permissions.effects";
import {rolesFeature} from "./roles/roles.feature";
import {permissionsFeature} from "./permissions/permissions.feature";
import {RolesState} from "./roles/roles.state";
import {PermissionsState} from "./permissions/models/permissions.state";
import {EmployeesEffects} from "./corporate/employees/employees.effects";
import {employeesFeature} from "./corporate/employees/employees.feature";
import {EmployeesState} from "./corporate/employees/employees.state";
import { contractsFeature } from "./corporate/contracts/contracts.feature";
import { ContractEffects } from "./corporate/contracts/contracts.effects";
import { LevelState } from "./schoolar/level/level.state";
import { ContractState } from "./corporate/contracts/contracts.state";
import { ServiceEffects } from "./corporate/services/service.effects";
import { ServiceState } from "./corporate/services/services.state";
import { MaterialEffects } from "./schoolar/materials/material.effects";
import { materialFeature } from "./schoolar/materials/material.feature";
import { AttendancesEffects } from "./schoolar/attendances/attendances.effects";
import { attendancesFeature } from "./schoolar/attendances/attendances.feature";
import { AttendancesState } from "./schoolar/attendances/attendances.state";
import { InstallmentsEffects } from "../store/finance/installments/installments.effects";
import { installmentsFeature } from "../store/finance/installments/installments.feature";
import { CentersEffects } from "./corporate/center/centers.effects";
import { TasksEffects } from "./settings/tasks/tasks.effects";
import { tasksFeature } from "./settings/tasks/tasks.feature";
import { TasksState } from "./settings/tasks/tasks.state";
import { LocationEffects } from "./location/location.effects";
import { locationFeature } from "./location/location.feature";
import { LocationState } from "./location/location.state";

export interface AppState {
    students: StudentState;
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
    levels: LevelState;
    contracts: ContractState;
    services: ServiceState;
    attendances: AttendancesState;
    tasks: TasksState;
    location: LocationState;
}

export const AppEffects = [
    AuthEffects,
    CentersEffects,
    StudentsEffects,
    UnitEffects,
    LevelEffects,
    LessonsEffects,
    RolesEffects,
    PermissionsEffects,
    EmployeesEffects,
    ContractEffects,
    ServiceEffects,
    MaterialEffects,
    AttendancesEffects,
    InstallmentsEffects,
    TasksEffects,
    LocationEffects
]

export const AppFeatures = [
    studentsFeature,
    levelsFeature,
    unitFeature,
    CenterFeature,
    serviceFeature,
    authFeature,
    lessonsFeature,
    rolesFeature,
    permissionsFeature,
    employeesFeature,
    contractsFeature,
    serviceFeature,
    materialFeature,
    attendancesFeature,
    installmentsFeature,
    tasksFeature,
    locationFeature
]
