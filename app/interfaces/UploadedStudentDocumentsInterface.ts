import { StudentDocument } from "./StudentDocumentInterface";
import { Student } from "./StudentInterface";

export type UploadedStudentDocument = {
  id: number;
  studentId: number;
  documentId: number;
  url: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;

  document: StudentDocument;
  student: Student;
};
