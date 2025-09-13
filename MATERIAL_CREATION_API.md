# Material Creation API Implementation

This document describes the implementation of the Material Creation API with Relations in the Angular frontend application.

## Overview

The Material Creation API allows creating educational materials with various types of relationships to other entities in the system. The API supports different file types, content types, and can relate materials to students, lessons, units, assessments, levels, centers, employees, and contracts.

## API Endpoint

```
POST {{baseUrl}}/materials/create-with-relations
```

## Request Body Structure

```typescript
{
  "title": string;
  "description": string;
  "fileType": "PDF" | "VIDEO" | "AUDIO" | "PRESENTATION" | "WORKSHEET" | "DOCX" | "EXCEL";
  "type": "TIPS" | "PROGRAMATIC_CONTENT" | "GENERAL_CONTENT" | "MANUAL" | "EXERCISE" | "QUIZ" | "TEST" | "HOMEWORK" | "PRACTICAL" | "BUSINESS" | "OTHER";
  "fileUrl": string;
  "uploaderId": string;
  "active": boolean;
  "availabilityStartDate": string; // ISO date format
  "availabilityEndDate": string; // ISO date format
  "relations": [
    {
      "relatedEntityType": "STUDENT" | "LESSON" | "UNIT" | "ASSESSMENT" | "LEVEL" | "CENTER" | "EMPLOYEE" | "CONTRACT";
      "relatedEntityId": string;
      "description": string;
      "orderIndex": number;
      "isRequired": boolean;
      "isActive": boolean;
    }
  ]
}
```

## Response Structure

```typescript
{
  "success": boolean;
  "message": string;
  "data": {
    "id": string;
    "title": string;
    "description": string;
    "fileType": string;
    "type": string;
    "fileUrl": string;
    "uploaderId": string;
    "uploaderName": string;
    "active": boolean;
    "availabilityStartDate": string;
    "availabilityEndDate": string;
    "relations": [
      {
        "id": string;
        "relatedEntityType": string;
        "relatedEntityId": string;
        "relatedEntityName": string;
        "description": string;
        "orderIndex": number;
        "isRequired": boolean;
        "isActive": boolean;
        "createdAt": string;
        "updatedAt": string;
      }
    ];
    "createdAt": string;
    "updatedAt": string;
  };
  "timestamp": string;
  "metadata": any[];
}
```

## Implementation Files

### 1. Enums

#### MaterialType (`src/app/core/enums/material-type.ts`)
```typescript
export enum MaterialType {
    PDF = 'PDF',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    PRESENTATION = 'PRESENTATION',
    WORKSHEET = 'WORKSHEET',
    DOCX = 'DOCX',
    EXCEL = 'EXCEL'
}
```

#### MaterialContentType (`src/app/core/enums/material-content-type.ts`)
```typescript
export enum MaterialContentType {
    TIPS = 'TIPS',
    PROGRAMATIC_CONTENT = 'PROGRAMATIC_CONTENT',
    GENERAL_CONTENT = 'GENERAL_CONTENT',
    MANUAL = 'MANUAL',
    EXERCISE = 'EXERCISE',
    QUIZ = 'QUIZ',
    TEST = 'TEST',
    HOMEWORK = 'HOMEWORK',
    PRACTICAL = 'PRACTICAL',
    BUSINESS = 'BUSINESS',
    OTHER = 'OTHER'
}
```

#### RelatedEntityType (`src/app/core/enums/related-entity-type.ts`)
```typescript
export enum RelatedEntityType {
    STUDENT = 'STUDENT',
    LESSON = 'LESSON',
    UNIT = 'UNIT',
    ASSESSMENT = 'ASSESSMENT',
    LEVEL = 'LEVEL',
    CENTER = 'CENTER',
    EMPLOYEE = 'EMPLOYEE',
    CONTRACT = 'CONTRACT'
}
```

### 2. Models

#### MaterialRelation (`src/app/core/models/academic/material-relation.ts`)
```typescript
export interface MaterialRelation {
    id?: string;
    relatedEntityType: string;
    relatedEntityId: string;
    relatedEntityName?: string;
    description: string;
    orderIndex: number;
    isRequired: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}
```

#### Material (`src/app/core/models/academic/material.ts`)
```typescript
export interface Material {
    id: string;
    title: string;
    description: string;
    fileType: string;
    type: string;
    fileUrl: string;
    uploaderId: string;
    uploaderName?: string;
    active: boolean;
    availabilityStartDate: string;
    availabilityEndDate: string;
    relations?: MaterialRelation[];
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
```

### 3. Service

#### MaterialService (`src/app/core/services/material.service.ts`)
```typescript
createMaterialWithRelations(material: MaterialCreateRequest): Observable<Material> {
  return this.http.post<ApiResponse<Material>>(`${this.apiUrl}/create-with-relations`, material).pipe(
    map((response) => response.data as Material)
  );
}
```

## Usage Examples

### Basic Usage

```typescript
import { MaterialService } from './core/services/material.service';
import { MaterialType, MaterialContentType, RelatedEntityType } from './core/enums';

// Inject the service
constructor(private materialService: MaterialService) {}

// Create material data
const materialData: MaterialCreateRequest = {
  title: "Questionario",
  description: "Questionario da aula de ontem",
  fileType: MaterialType.PDF,
  type: MaterialContentType.TIPS,
  fileUrl: "https://github.com/juniorjrjl",
  uploaderId: "2c42fc7c-5e3d-43f7-a3d8-cd13e0554cad",
  active: true,
  availabilityStartDate: "2025-09-13",
  availabilityEndDate: "2026-09-13",
  relations: [
    {
      relatedEntityType: RelatedEntityType.STUDENT,
      relatedEntityId: "2c42fc7c-5e3d-43f7-a3d8-cd13e0554cad",
      description: "Adicionando quest ao aluno",
      orderIndex: 1,
      isRequired: true,
      isActive: true
    }
  ]
};

// Call the API
this.materialService.createMaterialWithRelations(materialData).subscribe({
  next: (material) => {
    console.log('Material created:', material);
  },
  error: (error) => {
    console.error('Error creating material:', error);
  }
});
```

### Using the Examples Utility

```typescript
import { MaterialApiExamples } from './core/utils/material-api-examples';

// Initialize the examples utility
const examples = new MaterialApiExamples(this.materialService);

// Create a questionnaire for a student
const questionnaireData = examples.createQuestionnaireForStudent();
this.materialService.createMaterialWithRelations(questionnaireData).subscribe(/* ... */);

// Create a video lesson for multiple students
const videoLessonData = examples.createVideoLessonForStudents(['student1', 'student2']);
this.materialService.createMaterialWithRelations(videoLessonData).subscribe(/* ... */);
```

## Available File Types

- **PDF**: PDF documents
- **VIDEO**: Video files (MP4, AVI, etc.)
- **AUDIO**: Audio files (MP3, WAV, etc.)
- **PRESENTATION**: Presentation files (PPT, PPTX)
- **WORKSHEET**: Worksheet files
- **DOCX**: Word documents
- **EXCEL**: Excel spreadsheets

## Available Content Types

- **TIPS**: Tips and hints
- **PROGRAMATIC_CONTENT**: Programmatic content
- **GENERAL_CONTENT**: General educational content
- **MANUAL**: Manuals and guides
- **EXERCISE**: Exercises and practice materials
- **QUIZ**: Quizzes and quick assessments
- **TEST**: Formal tests and exams
- **HOMEWORK**: Homework assignments
- **PRACTICAL**: Practical exercises
- **BUSINESS**: Business-related content
- **OTHER**: Other types of content

## Available Related Entity Types

- **STUDENT**: Individual students
- **LESSON**: Specific lessons
- **UNIT**: Course units
- **ASSESSMENT**: Assessments and evaluations
- **LEVEL**: Educational levels
- **CENTER**: Educational centers
- **EMPLOYEE**: Company employees
- **CONTRACT**: Contracts and agreements

## Error Handling

The API returns standard HTTP status codes and error messages. Common error scenarios include:

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Best Practices

1. **Validation**: Always validate input data before sending requests
2. **Error Handling**: Implement proper error handling for API calls
3. **Loading States**: Show loading indicators during API calls
4. **User Feedback**: Provide clear feedback to users about success/failure
5. **Type Safety**: Use TypeScript interfaces for type safety
6. **Enum Usage**: Use enums instead of string literals for better maintainability

## Integration with Existing Components

The new API can be integrated with existing material creation components by:

1. Updating the component to use the new `MaterialCreateRequest` interface
2. Adding dropdowns for file types, content types, and related entity types
3. Implementing the relationship selection UI
4. Using the new service method for API calls

This implementation provides a complete foundation for material creation with relationships in your Angular application.
