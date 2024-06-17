import { Course } from "./CourseInterface";
import { StudentDocument } from "./StudentDocumentInterface";
import { UploadedStudentDocument } from "./UploadedStudentDocumentsInterface";

export type CourseStudentDocuments = {
  id: number;
  courseId: number;
  documentId: number;

  status: boolean;
  created_at: Date;
  updated_at: Date;

  course: Course;
  document: StudentDocument;
};
