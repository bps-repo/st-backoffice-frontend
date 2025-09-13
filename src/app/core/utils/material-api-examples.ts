import { MaterialCreateRequest, Material } from '../models/academic/material';
import { MaterialType } from '../enums/material-type';
import { MaterialContentType } from '../enums/material-content-type';
import { RelatedEntityType } from '../enums/related-entity-type';
import { MaterialService } from '../services/material.service';

/**
 * Example usage of the Material Creation API with Relations
 *
 * This file demonstrates how to use the createMaterialWithRelations method
 * to create materials with various types of relationships.
 */

export class MaterialApiExamples {
  constructor(private materialService: MaterialService) {}

  /**
   * Example 1: Create a PDF questionnaire for a specific student
   * This matches the API example you provided
   */
  createQuestionnaireForStudent(): MaterialCreateRequest {
    return {
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
  }

  /**
   * Example 2: Create a video lesson for multiple students
   */
  createVideoLessonForStudents(studentIds: string[]): MaterialCreateRequest {
    return {
      title: "Video Aula - Present Perfect",
      description: "Aula explicativa sobre Present Perfect Tense",
      fileType: MaterialType.VIDEO,
      type: MaterialContentType.PROGRAMATIC_CONTENT,
      fileUrl: "https://example.com/videos/present-perfect.mp4",
      uploaderId: "teacher-123",
      active: true,
      availabilityStartDate: "2025-01-01",
      availabilityEndDate: "2025-12-31",
      relations: studentIds.map((studentId, index) => ({
        relatedEntityType: RelatedEntityType.STUDENT,
        relatedEntityId: studentId,
        description: `Video lesson assigned to student ${studentId}`,
        orderIndex: index + 1,
        isRequired: true,
        isActive: true
      }))
    };
  }

  /**
   * Example 3: Create an exercise worksheet for a specific lesson
   */
  createExerciseForLesson(lessonId: string): MaterialCreateRequest {
    return {
      title: "Exercícios - Present Perfect",
      description: "Lista de exercícios para prática do Present Perfect",
      fileType: MaterialType.WORKSHEET,
      type: MaterialContentType.EXERCISE,
      fileUrl: "https://example.com/worksheets/present-perfect-exercises.pdf",
      uploaderId: "teacher-123",
      active: true,
      availabilityStartDate: "2025-01-01",
      availabilityEndDate: "2025-12-31",
      relations: [
        {
          relatedEntityType: RelatedEntityType.LESSON,
          relatedEntityId: lessonId,
          description: "Exercise worksheet for lesson",
          orderIndex: 1,
          isRequired: true,
          isActive: true
        }
      ]
    };
  }

  /**
   * Example 4: Create a quiz for a specific unit
   */
  createQuizForUnit(unitId: string): MaterialCreateRequest {
    return {
      title: "Quiz - Unit 5 Assessment",
      description: "Quiz de avaliação da Unidade 5",
      fileType: MaterialType.PDF,
      type: MaterialContentType.QUIZ,
      fileUrl: "https://example.com/quizzes/unit-5-quiz.pdf",
      uploaderId: "teacher-123",
      active: true,
      availabilityStartDate: "2025-01-01",
      availabilityEndDate: "2025-12-31",
      relations: [
        {
          relatedEntityType: RelatedEntityType.UNIT,
          relatedEntityId: unitId,
          description: "Quiz for unit assessment",
          orderIndex: 1,
          isRequired: true,
          isActive: true
        }
      ]
    };
  }

  /**
   * Example 5: Create a business manual for employees
   */
  createBusinessManualForEmployees(employeeIds: string[]): MaterialCreateRequest {
    return {
      title: "Manual de Procedimentos",
      description: "Manual interno de procedimentos da empresa",
      fileType: MaterialType.DOCX,
      type: MaterialContentType.MANUAL,
      fileUrl: "https://example.com/manuals/company-procedures.docx",
      uploaderId: "hr-manager-123",
      active: true,
      availabilityStartDate: "2025-01-01",
      availabilityEndDate: "2025-12-31",
      relations: employeeIds.map((employeeId, index) => ({
        relatedEntityType: RelatedEntityType.EMPLOYEE,
        relatedEntityId: employeeId,
        description: `Business manual for employee ${employeeId}`,
        orderIndex: index + 1,
        isRequired: true,
        isActive: true
      }))
    };
  }

  /**
   * Example 6: Create a test for a specific level
   */
  createTestForLevel(levelId: string): MaterialCreateRequest {
    return {
      title: "Teste de Nível - Intermediário",
      description: "Teste para avaliação do nível intermediário",
      fileType: MaterialType.PDF,
      type: MaterialContentType.TEST,
      fileUrl: "https://example.com/tests/intermediate-level-test.pdf",
      uploaderId: "teacher-123",
      active: true,
      availabilityStartDate: "2025-01-01",
      availabilityEndDate: "2025-12-31",
      relations: [
        {
          relatedEntityType: RelatedEntityType.LEVEL,
          relatedEntityId: levelId,
          description: "Level assessment test",
          orderIndex: 1,
          isRequired: true,
          isActive: true
        }
      ]
    };
  }

  /**
   * Example 7: Create homework for a specific center
   */
  createHomeworkForCenter(centerId: string): MaterialCreateRequest {
    return {
      title: "Tarefa de Casa - Semana 3",
      description: "Tarefa de casa para a terceira semana",
      fileType: MaterialType.PDF,
      type: MaterialContentType.HOMEWORK,
      fileUrl: "https://example.com/homework/week-3-homework.pdf",
      uploaderId: "teacher-123",
      active: true,
      availabilityStartDate: "2025-01-01",
      availabilityEndDate: "2025-12-31",
      relations: [
        {
          relatedEntityType: RelatedEntityType.CENTER,
          relatedEntityId: centerId,
          description: "Homework for center students",
          orderIndex: 1,
          isRequired: true,
          isActive: true
        }
      ]
    };
  }

  /**
   * Example 8: Create a practical exercise for a contract
   */
  createPracticalForContract(contractId: string): MaterialCreateRequest {
    return {
      title: "Exercício Prático - Contrato",
      description: "Exercício prático relacionado ao contrato",
      fileType: MaterialType.PDF,
      type: MaterialContentType.PRACTICAL,
      fileUrl: "https://example.com/practical/contract-exercise.pdf",
      uploaderId: "instructor-123",
      active: true,
      availabilityStartDate: "2025-01-01",
      availabilityEndDate: "2025-12-31",
      relations: [
        {
          relatedEntityType: RelatedEntityType.CONTRACT,
          relatedEntityId: contractId,
          description: "Practical exercise for contract",
          orderIndex: 1,
          isRequired: true,
          isActive: true
        }
      ]
    };
  }

  /**
   * Example of how to call the API service
   */
  async createMaterialExample(): Promise<Material> {
    const materialData = this.createQuestionnaireForStudent();

    try {
      const createdMaterial = await this.materialService.createMaterialWithRelations(materialData).toPromise();
      console.log('Material created successfully:', createdMaterial);
      return createdMaterial!;
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    }
  }

  /**
   * Get all available material types for dropdowns
   */
  getMaterialTypes() {
    return Object.values(MaterialType);
  }

  /**
   * Get all available content types for dropdowns
   */
  getContentTypes() {
    return Object.values(MaterialContentType);
  }

  /**
   * Get all available related entity types for dropdowns
   */
  getRelatedEntityTypes() {
    return Object.values(RelatedEntityType);
  }
}
