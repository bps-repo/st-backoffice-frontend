import { Center } from "../corporate/center";
import { Level } from "../course/level";
import {Unit} from "../course/unit";
import {User} from "../user.model";

export interface Student {
    id?: string;
    code: number;
    user: User;
    status: StudentStatus;
    levelProgressPercentage: number;
    center: Center;
    level: Level;
    currentUnit?: Unit;
    enrollmentDate: string;
    certificates?: any[];
    attendances?: any[];
    unitProgresses?: any[];
    // VIP fields
    vip?: boolean;
    vipTeacherId?: string | null;
    // Additional optional flags (minimal addition to align with backend data)
    directChatEnabled?: boolean;
    fixedDateClasses?: boolean;
    // Optional emergency and background info
    emergencyContactNumber?: string | null;
    emergencyContactName?: string | null;
    emergencyContactRelationship?: string | null;
    academicBackground?: string | null;
    province?: string | null;
    municipality?: string | null;
    notes?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export enum StudentStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    GRADUATED = 'GRADUATED',
    DROPPED_OUT = 'DROPPED_OUT',
    SUSPENDED = 'SUSPENDED',
    QUIT = 'QUIT',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
}
