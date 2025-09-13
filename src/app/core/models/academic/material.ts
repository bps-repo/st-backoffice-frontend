import {Employee} from "./lead-service";
import {Unit} from "../course/unit";
import {MaterialRelation} from "./material-relation";

export {MaterialRelation} from "./material-relation";

export interface Material {
    id: string;
    title: string;
    description: string;
    fileType?: string; // Optional for backward compatibility
    type: string;
    fileUrl: string;
    uploaderId?: string; // Optional for backward compatibility
    uploaderName?: string;
    uploader?: Employee; // Legacy field for backward compatibility
    uploadDate?: string; // Legacy field for backward compatibility
    active: boolean;
    availabilityStartDate: string;
    availabilityEndDate: string;
    relations?: MaterialRelation[];
    units?: Unit[]; // Legacy field for backward compatibility
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

// Legacy Material interface for backward compatibility
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
