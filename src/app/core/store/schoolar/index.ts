import {AuthEffects} from "../auth/effects/auth.effects";
import {CenterEffects} from "../corporate/effects/center.effects";
import {ServiceEffects} from "../course/effects/service.effects";
import {StudentsEffects} from "./students/students.effects";
import {UnitEffects} from "../course/effects/unit.effects";
import {LevelEffects} from "../course/effects/level.effects";
import {studentsFeature} from "./students/students.reducers";
import {levelFeature} from "../course/reducers/level.reducer";
import {unitFeature} from "../course/reducers/unit.reducer";
import {centerFeature} from "../corporate/reducers/center.reducer";
import {serviceFeature} from "../course/reducers/service.reducer";
import {authFeature} from "../auth/reducers/auth.reducers";

export const AppEffects = [
    AuthEffects,
    CenterEffects,
    ServiceEffects,
    StudentsEffects,
    UnitEffects,
    ServiceEffects,
    LevelEffects
]


export const AppFeatures = [
    studentsFeature,
    levelFeature,
    unitFeature,
    centerFeature,
    serviceFeature,
    authFeature,
]
