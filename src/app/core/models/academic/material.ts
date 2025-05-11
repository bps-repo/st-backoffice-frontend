import {Employee} from "./lead-service";
import {Unit} from "../course/unit";

export interface Material {
    id: string;
    title: string;
    description: string;
    type: string;
    fileUrl: string;
    uploadDate: string;
    uploader: Employee;
    active: boolean;
    availabilityStartDate: string;
    availabilityEndDate: string;
    units: Unit[];
    createdAt: string;
    updatedAt: string;
}
