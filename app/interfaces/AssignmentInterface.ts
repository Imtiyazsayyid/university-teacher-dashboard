import { Division } from "./DivisionInterface";
import { Student } from "./StudentInterface";
import { Subject } from "./SubjectInterface";
import { Teacher } from "./TeacherInterface";

export type Assignment = {
  id: number;
  name: string;
  description: string | null;
  divisionId: number;
  teacherId: number;
  subjectId: number;
  dueDate: Date;
  subject: Subject;
  teacher: Teacher;
  division: Division;

  questions: AssignmentQuestion[];
  responses: AssignmentQuestionResponses[];
  material: AssignmentMaterial[];
  submittedAssignments: AssignmentsSubmitted[];
  assignmentUploads: AssignmentUploads[];

  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type AssignmentQuestion = {
  id: number;
  question: string;
  order: number;
  assignmentId: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type AssignmentMaterial = {
  id: number;
  material_url: string;
  assignmentId: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type AssignmentQuestionResponses = {
  id: number;
  answer: string;
  assignmentQuestionId: number;
  assignmentQuestion: AssignmentQuestion;
  studentId: number;
  assignmentId: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type AssignmentUploads = {
  id: number;
  material_url: string;
  studentId: number;
  assignmentId: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type AssignmentsSubmitted = {
  id: number;
  studentId: number;
  assignmentId: number;

  student: Student;
  assignment: Assignment;

  status: boolean;
  created_at: Date;
  updated_at: Date;
};
