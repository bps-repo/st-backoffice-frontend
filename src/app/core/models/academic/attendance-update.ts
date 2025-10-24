import { AttendanceStatus } from '../../enums/attendance-status';

export interface AttendanceStatusUpdate {
  status: AttendanceStatus;
  justification: string;
}
