import { Employee } from "../corporate/employee";
import { Unit } from "../course/unit";
import { MaterialRelation } from "./material-relation";

export { MaterialRelation } from "./material-relation";

export interface Material {
    id: string;
    title: string;
    description: string;
    fileType?: string;
    type: string;
    fileUrl: string;
    uploaderId?: string;
    uploaderName?: string;
    uploader?: Employee;
    uploadDate?: string;
    active: boolean;
    availabilityStartDate: string;
    availabilityEndDate: string;
    relations?: MaterialRelation[];
    units?: Unit[];
    createdAt: string;
    updatedAt: string;
}

export interface MaterialCreateRequest {
    title: string;
    description: string;
    fileType: string;
    type: string;
    fileUrl: string;
    uploaderId: string;
    active: boolean;
    availabilityStartDate: string;
    availabilityEndDate: string;
    relations: MaterialRelation[];
}

export interface LegacyMaterial {
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
